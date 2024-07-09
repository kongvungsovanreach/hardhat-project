$(document).ready(async () => {
    await initWebpage();
    await verifyCurrentAddress();

    // const balance = await getBalance('stone', '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199');
})

const updateBalance = async () => {
    let activeAccount = await getCurrentAccount(); // get current account
    if(activeAccount != null) {
        const stoneBalance = await getBalance('stone', activeAccount);
        const usdBalance = await getBalance('usd', activeAccount);
        $('#stone-balance').text(formatNumberWithCommas(parseFloat(stoneBalance).toFixed(2)));
        $('#usd-balance').text(formatNumberWithCommas(parseFloat(usdBalance).toFixed(2)));
    }
    $('.loading').hide();
}

const verifyCurrentAddress = async () => {
    const addressFromServer = $('#active-account-address').text();
    const activeAccount = await getCurrentAccount();
    
    if(addressFromServer != activeAccount) {
        $('#active-account-address').text(activeAccount ? activeAccount : '0x...');
    }
    updateBalance();
}

const initWebpage = async () => {
    let activeAccount = await getCurrentAccount(); // get current account
    //set the display account address
    $('span#active-account-address').text(activeAccount ? activeAccount : '0x...');
    //add event listener to borrow input (format with comma for styling)
    document.getElementById("borrow-payback-amount").addEventListener("input", handleInputChange);
    //check metamask connection
    await metamaskConnected().then(res => {
        if (res) {
            $('#disconnect-mm-btn').show();
            $('#connect-mm-btn').hide();
            $('.not-connect-msg').hide();
            accountChangeListener();
        } else {
            $('#disconnect-mm-btn').hide();
            $('#connect-mm-btn').show();
        }
    });

    //connect button handler function
    const connectMetamaskBtn = $('#connect-mm-btn');
    connectMetamaskBtn.on('click', async () => {
        await connectToMetaMask()
            .then(res => {
                $('.not-connect-msg').hide();
            })
            .catch(err => {
                console.log('[err]: error connecting to Metamask.')
            })
    })

    //borrow button handler function
    const borrowBtn = $('#borrow-btn');
    borrowBtn.on('click', async () => {
        let borrowAmount = $('#borrow-payback-amount').val();
        borrowAmount = parseFloat(borrowAmount.replace(/,/g, ''));
        $('.loading').show();
        await borrow(activeAccount, borrowAmount);
    })

    //repay button handler function
    const paybackBtn = $('#payback-btn');
    paybackBtn.on('click', async () => {
        let paybackAmount = $('#borrow-payback-amount').val();
        paybackAmount = parseFloat(paybackAmount.replace(/,/g, ''));
        $('.loading').show();
        await payback(activeAccount, paybackAmount);
    })

    //add event listener to the borrow input for updateing collateral amount
    $('#borrow-payback-amount').on('input', () => {
        const reqiured_collateral = cal_collateral(borrowAmount.val(), true);
        $('#required-collateral span').text(reqiured_collateral);
    });

    //disconnect button handler function
    const disconnectMetamaskBtn = $('#disconnect-mm-btn');
    disconnectMetamaskBtn.on('click', () => {
        // disconnectFromMetaMask().then(res => {}).catch(err => {})
        showToast('[msg]: user must disconnect using extension itself.', '#28a745');
    })

    //for predefined borrow and collateral amount
    const borrowAmount = $('#borrow-payback-amount');
    if (borrowAmount.val() != '') {
        $('#required-collateral').show();
    }
    const reqiured_collateral = cal_collateral($('#borrow-payback-amount').val(), true);
    $('#required-collateral span').text(reqiured_collateral);
}

const cal_collateral = (usd, withComma=false) => {
    const STONE_PRICE = 7524;
    const COLLATERALIZATION_RATIO = 666;
    let value = usd.replace(/,/g, ""); // Remove existing commas
    let collateral = (value * 10000 * 1000) / (STONE_PRICE * COLLATERALIZATION_RATIO);
    // collateral = ethers.utils.parseUnits(collateral.toString(), 18).toString();
    if(withComma){
        collateral = formatNumberWithCommas(collateral.toFixed(2));
        return collateral;
    }else{
        return collateral.toFixed(18);
    }
    
}

//add acount change listener
const accountChangeListener = () => {
    // Listen for account changes
    window.ethereum.on('accountsChanged', async (accounts) => {
        if (accounts.length === 0) {
            console.log('No accounts available');
        } else {
            // Update the current account
            activeAccount = accounts[0];
            $('span#active-account-address').text(activeAccount);
            await updateBalance();
            console.log('Account changed:', activeAccount);
        }
    });
}

//get current active account
const getCurrentAccount = async () => {
    let accounts = [];
    if (await metamaskConnected()) {
        try {
            //check if MetaMask is installed
            if (await metamaskInstalled()) {
                //request account access
                accounts = await window.ethereum.request({
                    method: 'eth_requestAccounts',
                });
            } else {
                showToast('[err]: metamask is not installed.');
            }
        } catch (error) {
            showToast('[err]: error retrieving account from metamask.');
        }
    } else {
        // showToast('[err]: metamask is not connected.');
    }
    return accounts.length ? accounts[0] : null;
}

//show toast message
const showToast = (msg, bgColor = '#ff0000') => {
    Toastify({
        text: msg,
        duration: 3000,
        style: { background: bgColor }
    }).showToast();
}

//check if metamask is already installed
const metamaskInstalled = async () => {
    return window.ethereum;
}

//check if metamask is connected
const metamaskConnected = async () => {
    if (! await metamaskInstalled()) {
        showToast('[msg]: metamask is not installed.');
        return false;
    } else {
        const isConnected = await window.ethereum.request({
            method: 'eth_accounts'
        }).then(res => {
            return res.length ? true : false;
        }).catch(err => {
            showToast('[err]: error getting account from Metamask.');
            return false;
        });
        return isConnected;
    }
}

//function for connecting to metamask
const connectToMetaMask = async () => {
    let accounts = []
    try {
        //check if MetaMask is installed
        if (await metamaskInstalled()) {
            //request account access
            accounts = await window.ethereum.request({
                method: 'eth_requestAccounts',
            });
            $('#disconnect-mm-btn').show();
            $('#connect-mm-btn').hide();
            $('span#active-account-address').text(accounts[0]);
            accountChangeListener();
        } else {
            showToast('[err]: metamask is not installed.');
        }
    } catch (error) {
        console.log(error)
        showToast('[err]: error retrieving account from metamask.');
    }
    return accounts
}

async function disconnectFromMetaMask() {
    try {
        if (await metamaskInstalled()) {
            if (await metamaskConnected()) {
                await window.ethereum.request({
                    method: 'wallet_requestPermissions',
                    params: [{ eth_accounts: {} }],
                }).then(() => ethereum.request({
                    method: 'eth_requestAccounts'
                }));
            } else {
                showToast('[err]: metamask is not connected.');
            }
        } else {
            showToast('[err]: metamask was not installed.');
        }
    } catch (error) {
        showToast('[err]: error disconnecting account from metamask.');
    }
}

//function to format number with commas
function formatNumberWithCommas(number) {
    let parts = number.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}

//function to handle input change
function handleInputChange() {
    let inputElement = document.getElementById("borrow-payback-amount");
    let value = inputElement.value.replace(/,/g, ""); //remove existing commas
    inputElement.value = formatNumberWithCommas(value); //format with commas
}