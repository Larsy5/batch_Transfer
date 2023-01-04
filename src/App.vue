<template>
  <el-row type="flex" class="row-bg" justify="center">
    <el-form ref="form" :model="form" label-width="80px" style="width: 80%" action="#">
      <!--      <el-form-item label="专家模式">-->
      <!--        <el-switch v-model="form.delivery"></el-switch>-->
      <!--      </el-form-item>-->
      <!--      <el-form-item label="抢新防杀">-->
      <!--        <el-switch v-model="form.defend"></el-switch>-->
      <!--      </el-form-item>-->
      <div>
        <el-form-item label="节点">
          <el-input v-model="form.node" disabled></el-input>
        </el-form-item>
      </div>
      <div style="display: flex;">
        <el-form-item label="地址">
          <el-input
              type="textarea"
              :rows="10"
              :cols="60"
              placeholder="请输入地址,一行一个数据"
              @change="isEmpty"
              v-model="form.privateKeyArray">
          </el-input>
        </el-form-item>
        <el-form-item label="日志">
          <el-input
              type="textarea"
              :rows="10"
              :cols="60"
              placeholder="输出日志"
              :autosize="{minRows:10,maxRows:500}"
              v-model="form.log"
              disabled>
          </el-input>
        </el-form-item>
      </div>
      <div>
        <!--        <el-form-item label="私钥">-->
        <!--          <el-input v-model="form.privateKeyArray"></el-input>-->
        <!--        </el-form-item>-->
      </div>
      <div>
        <el-form-item label="token合约">
          <el-input v-model="form.tokenAddr"></el-input>
        </el-form-item>
      </div>
      <div>
        <el-form-item label="池子类型">
          <el-select v-model="form.pond" placeholder="请选择池子类型">
            <el-option v-for="value in form.ponds" v-bind:key="value" :value="value"></el-option>
            <!-- <el-option label="USDT" value="USDT"></el-option>
            <el-option label="BNB" value="BNB"></el-option> -->
          </el-select>
        </el-form-item>
      </div>
      <div>
        <el-form-item label="交易金额">
          <el-input v-model="form.buyAmount" @change="isDecimal"></el-input>
        </el-form-item>
      </div>
      <div>
        <el-form-item label="卖出比率">
          <el-input v-model="form.rate"></el-input>
        </el-form-item>
      </div>
      <el-form-item label="GasPrice">
        <el-input v-model="form.gasPrice"></el-input>
      </el-form-item>
      <div>
        <el-form-item label="许可证">
          <el-input v-model="form.permit"></el-input>
        </el-form-item>
      </div>
      <el-row>
        <el-button type="primary" @click="buy()" :disabled="!form.buyNum || !form.privateKey">快速买入</el-button>
        <el-button type="success" @click="sell()" :disabled="!form.buyNum || !form.privateKey">快速卖出</el-button>
        <!--      <el-button type="info">是否可买入</el-button>-->
        <el-button type="warning">检查LP</el-button>
        <!--      <el-button type="danger">危险按钮</el-button>-->
      </el-row>
    </el-form>
  </el-row>

</template>
<script>
import {ethers} from "ethers";
import axios from "axios";
export default {
  data() {
    return {
      form: {
        privateKey: false,
        buyNum: false,
        node: '',
        buyAmount: 0,
        privateKeyArray: '',
        log: '',
        pond: 'USDT',
        ponds: ['USDT' , 'BNB'],
        tokenAddr:'',
        WBNB:'',
        BUSD:'',
        router:'',
        provider:'',
        wallet:'',
        permit: '',
        gasLimit:'2500000',
        gasPrice:ethers.utils.parseUnits('5','gwei').toString()
      },
      provider:''
    }
  },
  methods: {
    async buy() {
      //console.log(this.form.token);
      console.log(this.form.pond);

      // if(this.form.ponds=="USDT"){
      //   swap( )
      // }else if(this.form.ponds=='BNB'){
      //
      // }
      await this.swap(this.form.pond,"buy");
      //this.a();
    },
    async sell(){
      await this.swap(this.form.pond,"sell");
    },
    isEmpty() {
      if (this.form.privateKeyArray == '') {
        this.form.privateKey = false;
        return;
      }
      this.form.privateKey = true;
    },
    isDecimal() {
      console.log(this.form.buyAmount);
      var pattern = '^-?[1-9]\\d*$|^-?0\\.\\d*$|^-?[1-9]\\d*\\.\\d*$';
      var reg = new RegExp(pattern, 'g');
      if (reg.test(this.form.buyAmount)) {
        this.form.buyNum = true;
        return;
      }
      this.form.buyNum = false;
    },
    async isPermit(){
      if (this.form.permit == '') {
        console.log("许可证不能为空!");
        return false;
      }
      var ttl = await axios.get("http://localhost:8081/isPermit/" + this.form.permit);
      if (ttl.data == -2) {
        this.form.log = "许可证不正确或过期！";
        return false;
      }
      return true;
  //    await this.swap(this.form.ponds,"sell");

    },
    async swap(select,mode){
      this.form.log = '';
      let flag = await this.isPermit();
      if (!flag) {
        return;
      }
      console.log("进入交易")
      var privateKeys = this.form.privateKeyArray.split("\n");
      // this.form.log = "";
      let k=0,count=0,j=0;
      //获取bnb余额
      // let balance=await provider.getBalance(wallet.address)
      // const balanceInEth = ethers.utils.formatEther(balance);
      // console.log(balanceInEth);
      console.log(this.form.privateKeyArray.split("\n"));
      for (var i = 0; i < privateKeys.length; i++) {
        console.log(privateKeys[i]);
        // if (privateKeys[i].length != 64) {
        //   // console.log("11");
        //   this.form.log += privateKeys[i] + "交易失败!输入的密钥长度有误!\n";
        //   continue;
        // }
        console.log(privateKeys[i]);
        //this.form.log += privateKeys[i] + "交易成功!\n";
        // wallet.push(new ethers.Wallet(privateKeys[i]));
        //balance.push(await this.provider.getBalance(wallet[c++]))
        let wallet = new ethers.Wallet(privateKeys[i]);

        //console.log(wallet.length + '钱包长度');
        let signer = (wallet.connect(this.provider));
        const routerContract = new ethers.Contract(
            this.form.router,
            [
              'function getAmountsOut(uint amountIn, address[] memory path) public view returns(uint[] memory amounts)',
              'function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)'
            ],
            signer
        );

        let busdContract = new ethers.Contract(
            this.form.BUSD,
            [
              'function approve(address spender, uint256 amount) external returns (bool)',
              'function balanceOf(address account) external view returns (uint256)'
            ],
            signer
        )
        let WBNBContract = new ethers.Contract(
            this.form.WBNB,
            [
              'function approve(address spender, uint256 amount) external returns (bool)',
              'function balanceOf(address account) external view returns (uint256)'
            ],
            signer
        )

        let TokenContract;

        let amounts;
        const BUSDamountIn = ethers.utils.parseUnits(this.form.buyAmount, 18);

        let ArrayAddr=[];
        if(select=="USDT" && mode=="buy"){
            ArrayAddr.push(this.form.BUSD);
            ArrayAddr.push(this.form.tokenAddr);

          let tempPrice=busdContract.balanceOf(wallet.address);
          if(tempPrice<this.form.buyAmount){
            this.form.log+= privateKeys[i] + "您的余额不够";
            continue;
          }
          //对BUSD进行授权
          const approveTx = await busdContract.approve(
              this.form.router,
              BUSDamountIn
          );
          let reciept = await approveTx.wait();
          console.log(reciept);

        }else if(select=="BNB" && mode=="buy"){
            ArrayAddr.push(this.form.WBNB);
            ArrayAddr.push(this.form.tokenAddr);
          let tempPrice=ethers.utils.formatEther(await this.provider.getBalance(wallet.address))
          if(tempPrice < this.form.buyAmount){
            this.form.log+= privateKeys[i] + "您的余额不够";
            continue;
          }

          //bnb换wbnb
          const tx=await signer.sendTransaction({
            to:this.form.WBNB,
            value:ethers.utils.parseEther(this.form.buyAmount)
          })
          const receiptW= await tx.wait();
          console.log(receiptW);

          //对WBNB进行授权
           //对BUSD进行授权
           const approveTx = await WBNBContract.approve(
              this.form.router,
              BUSDamountIn
          );
          let receipt =await approveTx.wait();
          console.log(receipt);

        }else if(mode=="sell"){
          ArrayAddr.push(this.form.tokenAddr);
          ArrayAddr.push(this.form.WBNB);

         TokenContract= new ethers.Contract(
              this.form.tokenAddr,
              [
                'function approve(address spender, uint256 amount) external returns (bool)',
                'function balanceOf(address account) external view returns (uint256)'
              ],
              signer
          )

          //对Token进行授权
          const approveTx = await TokenContract.approve(
              this.form.router,
              BUSDamountIn
          );
          let reciept = await approveTx.wait();
          console.log(reciept);
        }

        amounts = await routerContract.getAmountsOut(BUSDamountIn, [ArrayAddr[0], ArrayAddr[1]]);
        const WBNBamountOutMin = amounts[1].sub(amounts[1].div(10));
        try {
          const swapTx = await routerContract.swapExactTokensForTokensSupportingFeeOnTransferTokens(
              BUSDamountIn,
              WBNBamountOutMin,
              [ArrayAddr[0], ArrayAddr[1]],
              wallet.address,
              Date.now() + 1000 * 60 * 10,
              {
                gasLimit: 2500000,
                gasPrice: this.form.gasPrice
              }
          )
          let receipt = await swapTx.wait();
          console.log(receipt);
          this.form.log += privateKeys[i] + "交易成功!\n";
        }catch (e) {
          this.form.log += e.message;
        }
      }
    },
    //针对目标token和BUSD的授权
    async approve_Token(amountIn){
      //BUSD授权
      busdContract = new ethers.Contract(
          this.form.tokenAddr,
          [
            'function approve(address spender, uint256 amount) external returns (bool)',
            'function balanceOf(address account) external view returns (uint256)'
          ],
          signer
      )
      const approveTx = await busdContract.approve(
          this.form.router,
          amountIn
      );
      let reciept = await approveTx.wait();
      console.log(reciept);
    }

  },
  mounted() {
    this.form.WBNB = "0xae13d989dac2f0debff460ac112a837c89baa7cd";
    this.form.BUSD = "0x78867BbEeF44f2326bF8DDd1941a4439382EF2A7";

    this.form.router = "0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3";

    this.form.node = "https://broken-wild-spring.bsc-testnet.discover.quiknode.pro/dece3361fe15dc8f847909f072f53c18dcc437dd";

    this.provider = new ethers.providers.JsonRpcProvider(this.form.node);

  },
  computed:{

  }
}
</script>
