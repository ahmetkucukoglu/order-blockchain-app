<template>
  <div id="header" class="row mt-3">
    <div class="col text-end">
      <span v-if="this.$store.state.accountAddress"
        ><i class="bi bi-circle-fill text-success"></i> Connected</span
      >
      <span v-if="!this.$store.state.accountAddress"
        ><i class="bi bi-circle-fill text-danger"></i> Disconnected
        <br /><button class="btn btn-sm btn-outline-success" @click="connect">
          Connect
        </button></span
      >
      <br />
      <span v-if="this.$store.state.accountAddress"
        >Contract Balance : {{ balance }} ETH</span
      >
    </div>
  </div>
</template>

<script>
import { eventHub } from "../main";
import Web3Service from "../services/Web3Service";
import ContractService from "../services/ContractService";

export default {
  name: "StatusBar",
  props: {},
  data() {
    return {
      balance: 0,
    };
  },
  methods: {
    async connect() {
      const { web3, accountAddress } = await Web3Service();
      this.$store.commit("setWeb3", web3);
      this.$store.commit("setAccountAddress", accountAddress);

      const contract = ContractService(
        web3,
        this.$store.state.contractAddress
      );
      this.$store.commit("setContract", contract);

      await this.updateBalance();
    },
    async updateBalance() {
      let currentBalance = await this.$store.state.web3.eth.getBalance(
        this.$store.state.contractAddress
      );
      currentBalance = this.$store.state.web3.utils.fromWei(
        currentBalance,
        "ether"
      );

      this.balance = currentBalance;
    },
  },
  async created() {
    await this.connect();

    eventHub.$on("updateBalance", () => {
      this.updateBalance();
    });

    eventHub.$on("changeAccount", (account) => {
      this.$store.commit("setAccountAddress", account);
    });
  },
};
</script>

<style scoped>
</style>
