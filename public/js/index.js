$(document).ready(async () => {
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
    const connectMetamaskBtn = $('#connect-mm-btn')
    connectMetamaskBtn.on('click', () => {
        connectToMetaMask().then(res => {
            $('.not-connect-msg').hide();
        }).catch(err => {

        })
    })

    //disconnect button handler function
    const disconnectMetamaskBtn = $('#disconnect-mm-btn')
    disconnectMetamaskBtn.on('click', () => {
        // disconnectFromMetaMask().then(res => {}).catch(err => {})
        showToast('[msg]: user must disconnect using extension itself.', '#00ff00');
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