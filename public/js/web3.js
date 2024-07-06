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
    "function borrow(uint256 tUSDTAmount) external",
    "function approve(address spender, uint256 value) public returns (bool)",
    
    // Get the account balance
    "function balanceOf(address) view returns (uint256)",
    "function transfer(address to, uint256 value) public returns (bool)"
];

const STONE = new ethers.Contract(STONE_TOKEN_ADDRESS, TOKEN_ABI, signer);
const USD = new ethers.Contract(USD_TOKEN_ADDRESS, TOKEN_ABI, signer);
const LENDING = new ethers.Contract(LENDING_TOKEN_ADDRESS, TOKEN_ABI, signer);

async function getBalance(token, address){
    const DECIMALS = await STONE.decimals();
    let balance = 0;
    switch(token){
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
    // console.log(await getBalance('stone' ,LENDING_TOKEN_ADDRESS));
    // console.log(await getBalance('usd', LENDING_TOKEN_ADDRESS))
    const depositAmount = ethers.utils.parseUnits('5000', 18).toString();
    console.log('aaa')
    await STONE.approve(LENDING_TOKEN_ADDRESS, depositAmount);
    console.log('bbbb')
    await LENDING.deposit(depositAmount);
    console.log('cccc')
    // await LENDING.borrow(usdAmount);
    // await USD.transfer(LENDING_TOKEN_ADDRESS, 50000);
    // console.log(await getBalance('usd', LENDING_TOKEN_ADDRESS))
    const borrowAmount = ethers.utils.parseUnits(usdAmount.toString(), 18).toString();
    console.log(borrowAmount)
    await LENDING.borrow(borrowAmount);
    console.log('dddd')
}