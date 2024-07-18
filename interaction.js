let web3;
let accounts;

document.getElementById("connectButton").onclick = async () => {
  if (typeof window.ethereum !== "undefined") {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      web3 = new Web3(window.ethereum);
      accounts = await web3.eth.getAccounts();
      chainID = await web3.eth.getChainId();
      document.getElementById("disconnectButton").disabled = false;
      document.getElementById("connectButton").disabled = true;
      document.getElementById("sendButton").disabled = false;
      document.getElementById("switchButton").disabled = false;
      document.getElementById("networkSelect").disabled = false;
      document.getElementById("networkSelect").value = chainID;
      document.getElementById("userAccount").innerHTML =
        "Connect Successfully and account address is : \n" + accounts[0];
    } catch (error) {
      console.error("User rejected the request.");
    }
  } else {
    alert("MetaMask is not installed.");
  }
};

document.getElementById("switchButton").onclick = async () => {
  const networkId = document.getElementById("networkSelect").value;
  const chainID = await web3.eth.getChainId();

  if (chainID != networkId)
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: web3.utils.toHex(networkId) }],
      });
      alert("Network switched");
    } catch (switchError) {
      if (switchError.code === 4902) {
        alert(
          "This network is not available in your MetaMask, please add it manually."
        );
      } else {
        console.error(switchError);
      }
    }
};

document.getElementById("sendButton").onclick = async () => {
  const amount = document.getElementById("amount").value;
  const receiver = document.getElementById("receiver").value;

  const gasPrice = await web3.eth.getGasPrice();
  const gasLimit = 21000;

  if (!web3 || !accounts) {
    alert("Connect to MetaMask first");
    return;
  }

  web3.eth
    .sendTransaction({
      from: accounts[0],
      to: receiver,
      value: web3.utils.toWei(amount, "ether"),
      gasPrice: gasPrice,
      gas: gasLimit,
    })
    .then((receipt) => {
      alert("Transaction successful");
      console.log("Transaction receipt:", receipt);
    })
    .catch((error) => {
      alert("Transaction failed");
      console.error("Transaction error:", error);
    });
};

document.getElementById("disconnectButton").onclick = () => {
  if (typeof window.ethereum !== "undefined") {
    window.ethereum.removeAllListeners();
    web3 = null;
    accounts = null;
    document.getElementById("disconnectButton").disabled = true;
    document.getElementById("connectButton").disabled = false;
    document.getElementById("sendButton").disabled = true;
    document.getElementById("switchButton").disabled = true;
    document.getElementById("networkSelect").disabled = true;
    document.getElementById("userAccount").innerHTML = "";
  }
};