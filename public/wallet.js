const goerliChainId = 5;
const polygonChainId = 137;
const zkSyncChainId = 324;
const forwarderOrigin = "http://localhost:3000";
let userAddress;

const initialize = () => {
  let dropdown = document.querySelector(".dropdown-menu");
  const sel_network = document.querySelector("h4 .sel_network");
  const connectButton = document.getElementById("connectWallet");
  const loaderBanner = document.querySelector(".loader-banner");
  const alert = document.querySelector(".alert");
  const modal_btn = document.querySelector(".modal_btn");
  const modalBody = document.querySelector(".modal-body");

  let web3;
  let chosenNetwork;

  const zkSyncNetwork = {
    chainId: Web3.utils.toHex(zkSyncChainId),
    chainName: " zkSync Era Mainnet",
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://mainnet.era.zksync.io"],
    blockExplorerUrls: ["https://explorer.zksync.io/"],
    // websocket: "wss://mainnet.era.zksync.io/ws"
  };

  //   const polygonNetwork = {
  //     chainId: Web3.utils.toHex(polygonChainId),
  //     chainName: "Polygon Mainnet",
  //     nativeCurrency: {
  //       name: "MATIC",
  //       symbol: "MATIC", // 2-6 characters long
  //       decimals: 18,
  //     },
  //     rpcUrls: ["https://polygon-rpc.com/"],
  //     blockExplorerUrls: ["https://polygonscan.com/"],
  //   };

  const allNetworks = [
    {
      id: 1,
      name: "zkSync",
      chainId: zkSyncChainId,
      networkDetails: {
        chainId: Web3.utils.toHex(zkSyncChainId),
        chainName: " zkSync Era Mainnet",
        nativeCurrency: {
          name: "ETH",
          symbol: "ETH",
          decimals: 18,
        },
        rpcUrls: ["https://mainnet.era.zksync.io"],
        blockExplorerUrls: ["https://explorer.zksync.io/"],
        // websocket: "wss://mainnet.era.zksync.io/ws"
      },
    },
    // {
    //   id: 2,
    //   name: "thinke",
    //   chainId: zkSyncChainId,
    //   networkDetails: {
    //     chainId: Web3.utils.toHex(zkSyncChainId),
    //     chainName: " zkSync Era Mainnet",
    //     nativeCurrency: {
    //       name: "ETH",
    //       symbol: "ETH",
    //       decimals: 18,
    //     },
    //     rpcUrls: ["https://mainnet.era.zksync.io"],
    //     blockExplorerUrls: ["https://explorer.zksync.io/"],
    //     // websocket: "wss://mainnet.era.zksync.io/ws"
    //   },
    // },
  ];

  while (dropdown.firstChild) {
    dropdown.removeChild(dropdown.firstChild);
  }

  allNetworks.forEach(function (item) {
    const tag = `<li
      <a class="dropdown-item" data-id="${item.id}" data-value="${
      item.name
    }" href="#">
        ${item.name.toUpperCase()}
      </a>
    </li>`;

    dropdown.innerHTML += tag;
  });

  const dropdownItems = document.querySelectorAll(
    ".dropdown-menu .dropdown-item"
  );

  dropdownItems.forEach(function (item) {
    item.addEventListener("click", function () {
      const selectedValue = this.getAttribute("data-value");
      const selectedId = this.getAttribute("data-id");
      chosenNetwork = allNetworks.find((item) => item.id == selectedId);
      console.log("Selected value:", chosenNetwork);
      connectButton.classList.remove("disabled");
      sel_network.innerText = selectedValue.toUpperCase();
    });
  });

  connectButton.onclick = connect;

  // const selectedNetworkChainId = zkSyncChainId;
  // const selectedNetwork = zkSyncNetwork;

  async function getUserDetails(ethereum, message = "") {
    const accounts = await ethereum.request({
      method: "eth_requestAccounts",
    });

    if (accounts.length > 0) {
      userAddress = accounts[0];
      console.log("User's wallet address:", userAddress);
      modalBody.innerText = message || `Wallet address:  ${userAddress}`;
      modal_btn.click();
    }
  }

  async function connect() {
    const { ethereum } = window;
    if (ethereum) {
      console.log("ethreum provider detected");
      ethereum.on("chainChanged", async (newChainId) => {
        console.log("Chain changed to", newChainId);
        getUserDetails(ethereum);
      });
      await ethereum.request({ method: "eth_requestAccounts" });
      web3 = new Web3(ethereum);
      await switchNetwork(chosenNetwork.chainId);
    } else {
      // installMetaMask();
      installMetaMsk();
    }
  }

  getCurrentChainId = async () => {
    const currentChainId = await web3.eth.getChainId();
    console.log("current chainId:", currentChainId);
    return currentChainId;
  };

  switchNetwork = async (chainId) => {
    const currentChainId = await web3.eth.getChainId();
    if (currentChainId != chainId) {
      try {
        await ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: Web3.utils.toHex(chainId) }],
        });

        console.log(`switched to chainid : ${chainId} succesfully`);
      } catch (err) {
        // getUserDetails(window.ethereum, err.message);

        console.log(
          `error occured while switching chain to chainId ${chainId}, err: ${err.message} code: ${err.code}`
        );
        if (err.code === 4902) {
          await addNetwork(chosenNetwork.networkDetails);
        }
      }
    } else {
      getUserDetails(window.ethereum);
    }
  };

  addNetwork = async (networkDetails) => {
    try {
      await ethereum.request({
        method: "wallet_addEthereumChain",
        params: [networkDetails],
      });
      getUserDetails(
        window.ethereum,
        `Added ${networkDetails.chainName} Network Successfully`
      );
    } catch (err) {
      getUserDetails(window.ethereum, err.message);
    }
  };

  function installMetaMsk() {
    let countdownSeconds = 7;
    let countdownTimer;
    alert.innerHTML = "";
    alert.classList.remove("hidden_item");
    const updateCountdownDisplay = () => {
      alert.innerHTML = `You do not have metamask extension installed. Redirecting you to install page in ${countdownSeconds} seconds`;
    };

    const startCountdown = () => {
      countdownTimer = setInterval(() => {
        updateCountdownDisplay();
        countdownSeconds--;

        if (countdownSeconds < 0) {
          clearInterval(countdownTimer);
          startInstallation();
        }
      }, 1000);
    };

    const cancelCountdown = () => {
      clearInterval(countdownTimer);
    };

    const startInstallation = () => {
      // connectButton.value = "Installation in progress";
      // connectButton.disabled = true;
      const onboarding = new MetaMaskOnboarding();
      onboarding.startOnboarding();
    };

    startCountdown();
  }

  function installMetaMask() {
    // const onboarding = new MetaMaskOnboarding({ forwarderOrigin });
    const onboarding = new MetaMaskOnboarding();
    connectButton.value = "Installation in progress";
    connectButton.disabled = true;
    onboarding.startOnboarding();
  }

  // connect();
};

window.addEventListener("DOMContentLoaded", initialize);
