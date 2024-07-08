async function main() {
    const [provider, ...accounts] = await ethers.getSigners();
  
    console.log("Owner address:", provider.address);
    console.log("Sample accounts:");
    accounts.slice(0, 19).forEach((account, index) => {
      console.log(`Account ${index + 1}: ${account}`);
    });
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  