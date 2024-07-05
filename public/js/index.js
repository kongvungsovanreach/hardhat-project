$(document).ready(async () => {
    let activeAccount = await getCurrentAccount();
    // const balance = await getBalance('stone', '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199');






    $('span#active-account-address').text(activeAccount ? activeAccount : '0x...');
    document.getElementById("borrow-amount").addEventListener("input", handleInputChange);

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
        await connectToMetaMask().then(res => {
            $('.not-connect-msg').hide();
        }).catch(err => {

        })
    })

    //disconnect button handler function
    const disconnectMetamaskBtn = $('#disconnect-mm-btn');
    disconnectMetamaskBtn.on('click', () => {
        // disconnectFromMetaMask().then(res => {}).catch(err => {})
        showToast('[msg]: user must disconnect using extension itself.', '#28a745');
    })

    //borrow button handler function
    const borrowBtn = $('#borrow-btn');
    borrowBtn.on('click', async () => {
        let borrowAmount = $('#borrow-amount').val();
        borrowAmount = parseFloat(borrowAmount.replace(/,/g, ''));
        await borrow(activeAccount, borrowAmount)
    })
})

//add acount change listener
const accountChangeListener = () => {
    // Listen for account changes
    window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
            console.log('No accounts available');
        } else {
            // Update the current account
            activeAccount = accounts[0];
            $('span#active-account-address').text(activeAccount);
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
        showToast('[err]: metamask is not connected.');
    }
    return accounts.length ? accounts[0] : null
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
    return window.ethereum
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

// Function to format number with commas
function formatNumberWithCommas(number) {
    // Convert number to string and split into parts
    let parts = number.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    // Join parts and return formatted number
    return parts.join(".");
}

// Function to handle input change
function handleInputChange() {
    let inputElement = document.getElementById("borrow-amount");
    let value = inputElement.value.replace(/,/g, ""); // Remove existing commas
    inputElement.value = formatNumberWithCommas(value); // Format with commas
}