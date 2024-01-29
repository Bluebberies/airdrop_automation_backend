const forwarderOrigin = "http://localhost:3000";
const { BigNumber } = require("ethers");
const { ethers } = require("ethers");

const initialize = () => {
  const connectButton = document.getElementById("connectWallet");
  const { ethereum } = window;

  const onboardMetaMaskClient = async () => {
    console.log("gegeg");
    if (!isMetamaskInstalled()) {
      // prompt the user to install it
      console.log("MetaMask is not installed :(");
      connectButton.value = "Click here to install metamask";
      connectButton.onclick = installMetaMask;
    } else {
      console.log("MetaMask is installed Hurray!!!!!");
      connectButton.onclick = connectMetaMask;
    }
  };

  const connectMetaMask = async () => {
    connectButton.disabled = true;
    try {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      connectButton.value = "Connected";
      console.log("accounts: ", accounts);
      connectButton.disabled = false;
    } catch (err) {
      console.error("error occured while connecting to MetaMask: ", err);
    }
  };

  const isMetamaskInstalled = () => {
    return ethereum && ethereum.isMetaMask;
  };

  const installMetaMask = () => {
    const onboarding = new MetaMaskOnboarding({ forwarderOrigin });
    connectButton.value = "Installation in progress";
    connectButton.disabled = true;
    onboarding.startOnboarding();
  };

  //   const DetectMetamaskChain()

  onboardMetaMaskClient();
};

// window.addEventListener("DOMContentLoaded", initialize);
(async function getGasPrice() {
  await this.getNetwork();

  const result = await this.perform("getGasPrice", {});
  console.log("%%%%%%%%%%%%", result);
  try {
    console.log("%%%%%%%%%%%%@", BigNumber.from(result));
    return BigNumber.from(result);
  } catch (error) {
    return logger.throwError(
      "bad result from backend",
      Logger.errors.SERVER_ERROR,
      {
        method: "getGasPrice",
        result,
        error,
      }
    );
  }
})();

function applyL1ToL2Alias(address) {
  return ethers.utils.hexlify(
    ethers.BigNumber.from(address)
      .add(L1_TO_L2_ALIAS_OFFSET)
      .mod(ADDRESS_MODULO)
  );
}
