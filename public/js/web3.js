const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
console.log('[msg]: provider: ', provider);

const STONE_TOKEN_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
const USD_TOKEN_ADDRESS = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';
const LENDING_TOKEN_ADDRESS = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0';
const TOKEN_ABI = [
    // Some details about the token
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function decimals() view returns (uint8)",
    "function deposit(uint256 amount) external",
    "function borrow(uint256 USDAmount) external",
    "function repay(uint256 USDAmount) external",
    "function approve(address spender, uint256 value) public returns (bool)",
    "function balanceOf(address) view returns (uint256)",
    "function transfer(address to, uint256 value) public returns (bool)"
];

const STONE = new ethers.Contract(STONE_TOKEN_ADDRESS, TOKEN_ABI, signer);
const USD = new ethers.Contract(USD_TOKEN_ADDRESS, TOKEN_ABI, signer);
const LENDING = new ethers.Contract(LENDING_TOKEN_ADDRESS, TOKEN_ABI, signer);

async function getBalance(token, address) {
    const DECIMALS = await STONE.decimals();
    let balance = 0;
    switch (token) {
        case 'stone':
            balance = await STONE.balanceOf(address);
            break;
        case 'usd':
            balance = await USD.balanceOf(address);
            break;
        default:
            console.log('[err]: error retrieving balance.')
            break;
    }
    const readableBalance = await ethers.utils.formatUnits(balance, DECIMALS);
    return readableBalance;
}

async function borrow(myAddress, usdAmount) {
    //calcualte collateral amount for a specific USD you want to borrow
    let requiredCollateral = cal_collateral(usdAmount.toString()).toString();
    const depositAmount = ethers.utils.parseUnits(requiredCollateral, 18).toString();

    //approve the deposit STONE (according to collateral) to Lending contract
    const approveRes = await STONE.approve(LENDING_TOKEN_ADDRESS, depositAmount)
    await approveRes.wait();
    const depositRes = await LENDING.deposit(depositAmount);
    await depositRes.wait();

    //borrow the USD from the Lending contract
    const borrowAmount = ethers.utils.parseUnits(usdAmount.toString(), 18).toString();
    const borrowRes = await LENDING.borrow(borrowAmount)
        .then(async res => {
            return res
        });
    await borrowRes.wait();
    console.log('borrow completed.');
    await updateBalance();
    $('.loading').hide();
}

async function payback(myAddress, usdAmount) {
    //calculate the actual payback in smalled
    paybackAmount = ethers.utils.parseUnits(usdAmount.toString(), 18).toString();
    const approveRes = await USD.approve(LENDING_TOKEN_ADDRESS, paybackAmount);
    await approveRes.wait();
    const paybackRes = await LENDING.repay(paybackAmount);
    await paybackRes.wait();
    console.log('payback completed.');
    await updateBalance();
    $('.loading').hide();
}