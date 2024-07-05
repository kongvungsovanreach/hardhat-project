$(document).ready(async () => {

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    console.log(provider)


    document.getElementById("borrow-amount").addEventListener("input", handleInputChange);
    //check metamask connection
    await metamaskConnected().then(res => {
        if (res) {
            $('#disconnect-mm-btn').show();
            $('#connect-mm-btn').hide();
            $('.not-connect-msg').hide();
        } else {
            $('#disconnect-mm-btn').hide();
            $('#connect-mm-btn').show();
        }
    });

    //connect button handler function
    const connectMetamaskBtn = $('#connect-mm-btn');
    connectMetamaskBtn.on('click', () => {
        connectToMetaMask().then(res => {
            $('.not-connect-msg').hide();
        }).catch(err => {

        })
    })

    //disconnect button handler function
    const disconnectMetamaskBtn = $('#disconnect-mm-btn');
    disconnectMetamaskBtn.on('click', () => {
        // disconnectFromMetaMask().then(res => {}).catch(err => {})
        showToast('[msg]: user must disconnect using extension itself.', '#00ff00');
    })

    //borrow button handler function
    const borrowBtn = $('#borrow-btn');
    borrowBtn.on('click', () => {
        let borrowAmount = $('#borrow-amount').val();
        borrowAmount = parseFloat(borrowAmount.replace(/,/g, ''));
        
    })
})

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
    if (!metamaskInstalled) {
        showToast('[msg]: metamask is not installed.');
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

const connectToMetaMask = async () => {
    let accounts = []
    try {
        //check if MetaMask is installed
        if (metamaskInstalled) {
            //request account access
            accounts = await window.ethereum.request({
                method: 'eth_requestAccounts',
            });
            $('#disconnect-mm-btn').show();
            $('#connect-mm-btn').hide();
        } else {
            showToast('[err]: metamask is not installed.');
        }
    } catch (error) {
        showToast('[err]: error retrieving account from metamask.');
    }
    return accounts
}

async function disconnectFromMetaMask() {
    try {
        if (metamaskConnected) {
            if (metamaskConnected) {
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