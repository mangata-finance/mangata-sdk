"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var t=require("@polkadot/util"),e=require("@polkadot/api"),n=require("@polkadot/rpc-provider/ws"),a=require("@mangata-finance/types"),i=require("@polkadot/util-crypto"),r=require("big.js"),s=require("uuid");function o(t){return t&&"object"==typeof t&&"default"in t?t:{default:t}}var c=o(r);class u{static async getChain(t){return(await t.rpc.system.chain()).toHuman()}static async getNodeName(t){return(await t.rpc.system.name()).toHuman()}static async getNodeVersion(t){return(await t.rpc.system.version()).toHuman()}static async calculateRewardsAmount(e,n,a){const i=await e.rpc.xyk.calculate_rewards_amount(n,a);return t.isHex(i.price.toString())?t.hexToBn(i.price.toString()):new t.BN(i.price)}static async calculateBuyPrice(e,n,a,i){const r=await e.rpc.xyk.calculate_buy_price(n,a,i);return new t.BN(r.price)}static async calculateSellPrice(e,n,a,i){const r=await e.rpc.xyk.calculate_sell_price(n,a,i);return new t.BN(r.price)}static async getBurnAmount(t,e,n,a){const i=await t.rpc.xyk.get_burn_amount(e,n,a);return JSON.parse(i.toString())}static async calculateSellPriceId(e,n,a,i){const r=await e.rpc.xyk.calculate_sell_price_id(n,a,i);return new t.BN(r.price)}static async calculateBuyPriceId(e,n,a,i){const r=await e.rpc.xyk.calculate_buy_price_id(n,a,i);return new t.BN(r.price)}}class d{static instance;db={};constructor(){}static getInstance(){return d.instance||(d.instance=new d),d.instance}hasAddressNonce=t=>!!this.db[t];setNonce=(t,e)=>{this.db[t]=e};getNonce=t=>this.db[t]}const l=d.getInstance(),y=async e=>(await e.query.assetRegistry.metadata.entries()).reduce(((e,[n,a])=>{const i=n.toHuman()[0].replace(/[, ]/g,""),r=a.toHuman(),{name:s,decimals:o,symbol:c}=r,u={id:i,chainId:0,decimals:Number(o.toString()),name:s,symbol:c,address:"MGA"===t.hexToString(c.toString())?"0xc7e3bda797d2ceb740308ec40142ae235e08144a":"ETH"===t.hexToString(c.toString())?"0x0000000000000000000000000000000000000000":""};return e[i]=u,e}),{}),g=async t=>(await t.query.xyk.liquidityAssets.entries()).reduce(((t,[e,n])=>{const a=e.args.map((t=>t.toHuman()))[0],i=n.toString().replace(/[, ]/g,"");return t[a]=i,t}),{}),w=async(e,n)=>(await e.query.tokens.accounts.entries(n)).reduce(((e,[n,a])=>{const i=JSON.parse(JSON.stringify(a)).free.toString(),r=JSON.parse(JSON.stringify(a)).frozen.toString(),s=JSON.parse(JSON.stringify(a)).reserved.toString(),o={free:t.isHex(i)?t.hexToBn(i):new t.BN(i),frozen:t.isHex(r)?t.hexToBn(r):new t.BN(r),reserved:t.isHex(s)?t.hexToBn(s):new t.BN(s)};return e[n.toHuman()[1].replace(/[, ]/g,"")]=o,e}),{}),p=async e=>{const n=await y(e);return Object.values(n).filter((t=>"1"!==t.id&&"3"!==t.id)).reduce(((e,n)=>{const a={...n,name:n.name.replace(/0x\w+/,"").replace(/[A-Z]/g," $&").trim(),symbol:n.symbol.includes("TKN")?n.symbol.split("-").reduce(((e,n)=>{const a=n.replace("TKN",""),i=a.startsWith("0x")?t.hexToBn(a).toString():a;return e.push(i),e}),[]).join("-"):n.symbol};return e[a.id]=a,e}),{})},m=new t.BN("0"),T=new t.BN("1"),N=new t.BN("10"),f=new t.BN("100"),h=new t.BN("1000"),x=new t.BN("10000"),A=new t.BN("100000"),k=new t.BN("1000000"),S=new t.BN("10000000"),B=new t.BN("100000000"),I=new t.BN("1000000000"),F=new t.BN("10000000000"),P=new t.BN("100000000000"),O=new t.BN("1000000000000"),b=new t.BN("10").pow(new t.BN(18)),v=(t,e)=>e.gt(m)?v(e,t.mod(e)):t,L=(t,e)=>{const n=((t,e)=>{const n=v(t,e);return n.isZero()?[m,m]:[t.div(n),e.div(n)]})(t,e);return n[1].mul(b).div(n[0])},q=async t=>{try{const e=(await t.query.issuance.promotedPoolsRewardsV2()).toHuman();return Object.keys(e)}catch(t){return[]}};class R{static async getNonce(t,e){return(await t.rpc.system.accountNextIndex(e)).toBn()}static async getAmountOfTokenIdInPool(e,n,a){const i=JSON.parse(JSON.stringify(await e.query.xyk.pools([n,a])));return[t.isHex(i[0])?t.hexToBn(i[0]):new t.BN(i[0]),t.isHex(i[1])?t.hexToBn(i[1]):new t.BN(i[1])]}static async getLiquidityTokenId(e,n,a){const i=await e.query.xyk.liquidityAssets([n,a]);return i?new t.BN(i.toString()):t.BN_ZERO}static async getLiquidityPool(e,n){const a=JSON.parse(JSON.stringify(await e.query.xyk.liquidityPools(n)));return a?a.map((e=>new t.BN(e))):[new t.BN(-1),new t.BN(-1)]}static async getTotalIssuance(e,n){const a=await e.query.tokens.totalIssuance(n);return new t.BN(a.toString())}static async getTokenBalance(e,n,a){const{free:i,reserved:r,frozen:s}=JSON.parse(JSON.stringify(await e.query.tokens.accounts(n,a)));return{free:t.isHex(i.toString())?t.hexToBn(i.toString()):new t.BN(i.toString()),reserved:t.isHex(r.toString())?t.hexToBn(r.toString()):new t.BN(r.toString()),frozen:t.isHex(s.toString())?t.hexToBn(s.toString()):new t.BN(s.toString())}}static async getNextTokenId(e){const n=await e.query.tokens.nextCurrencyId();return new t.BN(n.toString())}static async getTokenInfo(t,e){return(await this.getAssetsInfo(t))[e]}static async getLiquidityTokenIds(t){return(await t.query.xyk.liquidityAssets.entries()).map((t=>t[1].toString()))}static async getLiquidityTokens(t){const e=await this.getAssetsInfo(t);return Object.values(e).reduce(((t,e)=>(e.name.includes("Liquidity Pool Token")&&(t[e.id]=e),t)),{})}static async getAssetsInfo(e){const n=await y(e);return Object.values(n).filter((t=>!["1","3","6"].includes(t.id))).reduce(((e,a)=>{const i={...a,name:a.name.replace(/0x\w+/,"").replace(/[A-Z]/g,"$&").trim(),symbol:a.symbol.includes("TKN")?a.symbol.split("-").reduce(((e,a)=>{const i=a.replace("TKN",""),r=i.startsWith("0x")?t.hexToBn(i).toString():i,s=n[r].symbol;return e.push(s),e}),[]).join("-"):a.symbol};return e[i.id]=i,e}),{})}static async getBlockNumber(t){return(await t.rpc.chain.getBlock()).block.header.number.toString()}static async getOwnedTokens(t,e){if(!e)return null;const[n,a]=await Promise.all([this.getAssetsInfo(t),w(t,e)]);return Object.values(n).reduce(((t,e)=>(Object.keys(a).includes(e.id)&&(t[e.id]={...e,balance:a[e.id]}),t)),{})}static async getBalances(e){return(await e.query.tokens.totalIssuance.entries()).reduce(((e,[n,a])=>{const i=n.toHuman()[0].replace(/[, ]/g,""),r=new t.BN(a.toString());return e[i]=r,e}),{})}static async getInvestedPools(e,n){const[a,i,r]=await Promise.all([p(e),w(e,n),q(e)]),s=Object.values(a).reduce(((t,e)=>(Object.keys(i).includes(e.id)&&e.name.includes("Liquidity Pool Token")&&t.push(e),t)),[]).map((async n=>{const a=i[n.id],s=n.symbol.split("-")[0],o=n.symbol.split("-")[1],[c,u]=await this.getAmountOfTokenIdInPool(e,s.toString(),o.toString()),d=await(async(e,n,a)=>{if(a.isZero())return m;const i=await e.query.tokens.totalIssuance(n),r=new t.BN(i.toString());return a.mul(b).div(r)})(e,n.id,a.free.add(a.reserved));return{firstTokenId:s,secondTokenId:o,firstTokenAmount:c,secondTokenAmount:u,liquidityTokenId:n.id,isPromoted:r.includes(n.id),share:d,firstTokenRatio:d.eq(t.BN_ZERO)?t.BN_ZERO:L(c,u),secondTokenRatio:d.eq(t.BN_ZERO)?t.BN_ZERO:L(u,c),activatedLPTokens:a.reserved,nonActivatedLPTokens:a.free}}));return Promise.all(s)}static async getPool(e,n){const a=await this.getLiquidityPool(e,n),i=(await e.query.issuance.promotedPoolsRewardsV2()).toHuman()[n],[r,s]=a,[o,c]=await this.getAmountOfTokenIdInPool(e,r.toString(),s.toString());return{firstTokenId:r.toString(),secondTokenId:s.toString(),firstTokenAmount:o,secondTokenAmount:c,liquidityTokenId:n,isPromoted:void 0!==i&&new t.BN(i.rewards.replace(/[, ]/g,"")).gt(t.BN_ZERO),firstTokenRatio:L(o,c),secondTokenRatio:L(c,o)}}static async getPools(e){const[n,a]=await Promise.all([p(e),g(e)]),i=await(async(e,n)=>(await e.query.xyk.pools.entries()).reduce(((e,[a,i])=>{const r=a.args.map((t=>t.toHuman()))[0],s=JSON.parse(JSON.stringify(i)).map((e=>t.isHex(e)?t.hexToBn(e):new t.BN(e)));return e[n[r]]=s,e}),{}))(e,a),r=await q(e);return Object.values(n).reduce(((t,e)=>Object.values(a).includes(e.id)?t.concat(e):t),[]).map((t=>{const[e,n]=i[t.id];return{firstTokenId:t.symbol.split("-")[0],secondTokenId:t.symbol.split("-")[1],firstTokenAmount:e,secondTokenAmount:n,liquidityTokenId:t.id,firstTokenRatio:L(e,n),secondTokenRatio:L(n,e),isPromoted:r.includes(t.id)}}))}}const M=(t,e)=>e?.meta.args.at(-1)?.type.eq("XcmV2WeightLimit")?{Limited:t}:t,_=(t,e)=>"BNC"===t?{parents:"0",interior:{x1:{generalKey:"0x0001"}}}:"vBNC"===t?{parents:"0",interior:{x1:{generalKey:"0x0101"}}}:"ZLK"===t?{parents:"0",interior:{x1:{generalKey:"0x0207"}}}:"vsKSM"===t?{parents:"0",interior:{x1:{generalKey:"0x0404"}}}:"vKSM"===t?{parents:"0",interior:{x1:{generalKey:"0x0104"}}}:"USDT"===t?{parents:"0",interior:{x2:[{PalletInstance:50},{GeneralIndex:1984}]}}:"RMRK"===t?{parents:"0",interior:{x2:[{PalletInstance:50},{GeneralIndex:8}]}}:{parents:"1",interior:e.v1.interior};const H=async(t,e,n,a)=>new Promise((async(i,r)=>{const s="string"==typeof n?n:n.address;let o=!1;const c=await(async(t,e,n)=>{let a;if(n&&n.nonce)a=n.nonce;else{const n=await R.getNonce(t,e);a=l.hasAddressNonce(e)?l.getNonce(e):n,n&&n.gt(a)&&(a=n);const i=a.addn(1);l.setNonce(e,i)}return a})(t,s,a);try{await e.signAsync(n,{nonce:c,signer:a?.signer})}catch(t){r(t)}console.info(`submitting Tx[${e.hash.toString()}]who: ${s} nonce: ${c.toString()} `);try{const n=await e.send((async u=>{if(console.info(`Tx[${e.hash.toString()}]who: ${s} nonce: ${c.toString()} => ${u.status.type}(${u.status.value.toString()})${function(t,e){if(!process.env.TX_VERBOSE)return"";const n=JSON.parse(e.method.toString()),a=JSON.stringify(n.args),i=t.registry.findMetaCall(e.method.callIndex);if("sudo"==i.method&&"sudo"==i.method){const a=e.method.args[0].callIndex,i=JSON.stringify(n.args.call.args),r=t.registry.findMetaCall(a);return` (sudo:: ${r.section}:: ${r.method}(${i})`}return` (${i.section}:: ${i.method}(${a}))`}(t,e)}`),a?.statusCallback?.(u),!u.status.isInBlock&&!u.status.isFinalized||o){if(u.isError){console.info("Transaction Error Result",JSON.stringify(u,null,2)),r(`Tx([${e.hash.toString()}]) Transaction error`);const n=await R.getNonce(t,s);l.setNonce(s,n)}}else{let d;o=!0,u.status.isInBlock?d=u.status.asInBlock.toString():u.status.isFinalized&&(d=u.status.asFinalized.toString());const y=(await t.rpc.chain.getHeader(d)).number.toBn(),g=y.addn(0),w=y.addn(10),p=g,m=await t.rpc.chain.subscribeNewHeads((async o=>{const u=o.number.toBn();if(p.gt(w)){m(),r(`Tx([${e.hash.toString()}])\n                      was not executed in blocks : ${g.toString()}..${w.toString()}`);const a=await R.getNonce(t,s);return l.setNonce(s,a),void n()}if(u.gte(p)){const r=await t.rpc.chain.getBlockHash(p),o=await t.rpc.chain.getHeader(r),u=(await t.rpc.chain.getBlock(o.hash)).block.extrinsics,d=JSON.parse(JSON.stringify(await t.query.system.events.at(o.hash)));p.iaddn(1);const l=u.findIndex((t=>t.hash.toString()===e.hash.toString()));if(l<0)return void console.info(`Tx([${e.hash.toString()}]) not found in block ${p} $([${(t=>{if(!t)return"";const e=t.length;return t.substring(0,7)+"..."+t.substring(e-5,e)})(r.toString())}])`);m(),console.info(`Tx[${e.hash.toString()}]who:${s} nonce:${c.toString()} => Executed(${r.toString()})`);const y=d.filter((t=>t.phase.isApplyExtrinsic&&t.phase.asApplyExtrinsic.toNumber()===l)).map((e=>{const{event:n,phase:a}=e,i=n.typeDef,r=n.data.map(((t,e)=>({lookupName:i[e].lookupName,data:t})));return{event:n,phase:a,section:n.section,method:n.method,metaDocumentation:n.meta.docs.toString(),eventData:r,error:E(t,n.method,r)}}));a?.extrinsicStatus?.(y),i(y),n()}}))}}))}catch(e){const n=await R.getNonce(t,s);l.setNonce(s,n),r({data:e.message||e.description||e.data?.toString()||e.toString()})}})),E=(e,n,a)=>{if("ExtrinsicFailed"===n){const n=a.find((t=>t.lookupName.includes("DispatchError"))),i=n?.data?.toHuman?.(),r=i?.Module?.error,s=i?.Module?.index;if(!r||!s)return{documentation:["Unknown error"],name:"UnknownError"};try{const n=e.registry.findMetaError({error:t.isHex(r)?t.hexToU8a(r):new t.BN(r),index:new t.BN(s)});return{documentation:n.docs,name:n.name}}catch(t){return{documentation:["Unknown error"],name:"UnknownError"}}}return null};class J{static async sendKusamaTokenFromRelayToParachain(a,i,r,s,o,c){const u=new n.WsProvider(a),d=await new e.ApiPromise({provider:u,noInitWarn:!0}).isReady;await d.tx.xcmPallet.limitedReserveTransferAssets({V3:{parents:0,interior:{X1:{Parachain:o}}}},{V3:{parents:0,interior:{X1:{AccountId32:{id:d.createType("AccountId32",r).toHex()}}}}},{V3:[{id:{Concrete:{parents:0,interior:"Here"}},fun:{Fungible:s}}]},0,{Limited:{refTime:new t.BN("298368000"),proofSize:0}}).signAndSend(i,{signer:c?.signer,nonce:c?.nonce})}static async sendKusamaTokenFromParachainToRelay(e,n,a,i,r){const s={V1:{parents:1,interior:{X1:{AccountId32:{network:"Any",id:e.createType("AccountId32",a).toHex()}}}}},o=M(new t.BN("6000000000"),e.tx.xTokens.transfer);await e.tx.xTokens.transfer("4",i,s,o).signAndSend(n,{signer:r?.signer,nonce:r?.nonce})}static async sendTokenFromStatemineToMangata(...a){const[r,s,o,c,u,d,l,y]=a,g=new n.WsProvider(s),w=await new e.ApiPromise({provider:g,noInitWarn:!0}).isReady,p=i.encodeAddress(d,42),m=(await r.query.assetRegistry.metadata.entries()).filter((t=>JSON.stringify(t[1].toHuman()).includes(o)))[0],T=JSON.parse(JSON.stringify(m[1].toJSON()));T&&T.location&&await w.tx.polkadotXcm.limitedReserveTransferAssets({V3:{interior:{X1:{Parachain:2110}},parents:1}},{V3:{interior:{X1:{AccountId32:{id:w.createType("AccountId32",p).toHex()}}},parents:0}},{V3:[{fun:{Fungible:l},id:{Concrete:_(o,T.location)}}]},0,{Limited:{refTime:new t.BN(c),proofSize:0}}).signAndSend(u,{signer:y?.signer,nonce:y?.nonce})}static async sendTokenFromParachainToMangata(...a){const[r,s,o,c,u,d,l,y]=a,g=new n.WsProvider(s),w=await new e.ApiPromise({provider:g,noInitWarn:!0}).isReady,p=i.encodeAddress(d,42),m=(await r.query.assetRegistry.metadata.entries()).filter((t=>JSON.stringify(t[1].toHuman()).includes(o)))[0],T=JSON.parse(JSON.stringify(m[1].toJSON()));if(T&&T.location){const e=["BNC","vBNC","ZLK","vsKSM","vKSM","IMBU"];let n=null,a=null;e.includes(o)?(n={V2:{id:{Concrete:_(o,T.location)},fun:{Fungible:l}}},a={V2:{parents:1,interior:{X2:[{Parachain:2110},{AccountId32:{network:"Any",id:w.createType("AccountId32",p).toHex()}}]}}}):(n={V1:{id:{Concrete:_(o,T.location)},fun:{Fungible:l}}},a={V1:{parents:1,interior:{X2:[{Parachain:2110},{AccountId32:{network:"Any",id:w.createType("AccountId32",p).toHex()}}]}}});let i=null;i=e.includes(o)?{Limited:{refTime:new t.BN(c),proofSize:0}}:M(new t.BN(c),w.tx.xTokens.transferMultiasset),await w.tx.xTokens.transferMultiasset(n,a,i).signAndSend(u,{signer:y?.signer,nonce:y?.nonce})}}static async sendTokenFromMangataToParachain(...e){const[n,a,r,s,o,c,u,d]=e,l=i.encodeAddress(c,42),y=(await n.query.assetRegistry.metadata.entries()).filter((t=>JSON.stringify(t[1].toHuman()).includes(a)))[0],g=JSON.parse(JSON.stringify(y[1].toJSON()));if(g&&g.location){const e=y[0].toHuman()[0].replace(/[, ]/g,""),a={V1:{parents:1,interior:{X2:[{Parachain:s},{AccountId32:{network:"Any",id:n.createType("AccountId32",l).toHex()}}]}}},i=M(new t.BN(r),n.tx.xTokens.transfer);await H(n,n.tx.xTokens.transfer(e,u,a,i),o,d)}}static async sendTurTokenFromTuringToMangata(a,r,s,o,c,u){const d=new n.WsProvider(r),l=await new e.ApiPromise({provider:d}).isReady,y=i.encodeAddress(o,42),g={V1:{id:{Concrete:{parents:1,interior:{X1:{Parachain:2114}}}},fun:{Fungible:c}}},w={V1:{parents:1,interior:{X2:[{Parachain:2110},{AccountId32:{network:"Any",id:a.createType("AccountId32",y).toHex()}}]}}},p=M(new t.BN("4000000000"),a.tx.xTokens.transferMultiasset);await l.tx.xTokens.transferMultiasset(g,w,p).signAndSend(s,{signer:u?.signer,nonce:u?.nonce})}static async sendTurTokenFromMangataToTuring(e,n,a,r,s){const o=i.encodeAddress(a,42),c={V1:{parents:1,interior:{X2:[{Parachain:2114},{AccountId32:{network:"Any",id:e.createType("AccountId32",o).toHex()}}]}}};await H(e,e.tx.xTokens.transfer("7",r,c,new t.BN("6000000000")),n,s)}static async activateLiquidity(t,e,n,a,i){return await H(t,t.tx.proofOfStake.activateLiquidity(n,a,null),e,i)}static async deactivateLiquidity(t,e,n,a,i){return await H(t,t.tx.proofOfStake.deactivateLiquidity(n,a),e,i)}static async claimRewards(t,e,n,a,i){return await H(t,t.tx.proofOfStake.claimRewardsAll(n),e,i)}static async createPool(t,e,n,a,i,r,s){return await H(t,t.tx.xyk.createPool(n,a,i,r),e,s)}static async sellAsset(t,e,n,a,i,r,s){return await H(t,t.tx.xyk.sellAsset(n,a,i,r),e,s)}static async buyAsset(t,e,n,a,i,r,s){return await H(t,t.tx.xyk.buyAsset(n,a,i,r),e,s)}static async mintLiquidity(t,e,n,a,i,r,s){return await H(t,t.tx.xyk.mintLiquidity(n,a,i,r),e,s)}static async burnLiquidity(t,e,n,a,i,r){return await H(t,t.tx.xyk.burnLiquidity(n,a,i),e,r)}static async transferToken(t,e,n,a,i,r){return await H(t,t.tx.tokens.transfer(a,n,i),e,r)}static async transferAllToken(t,e,n,a,i){return await H(t,t.tx.tokens.transferAll(a,n,!0),e,i)}}const V=c.default("0"),D=c.default("1"),K=c.default("10"),U=c.default("100"),$=c.default("1000"),X=c.default("10000"),C=c.default("100000"),W=c.default("1000000"),G=c.default("10000000"),j=c.default("100000000"),Z=c.default("1000000000"),z=c.default("10000000000"),Q=c.default("100000000000"),Y=c.default("1000000000000");c.default.PE=256,c.default.NE=-256,c.default.DP=40,c.default.RM=c.default.roundUp;const tt=K.pow(18),et=(e,n)=>{if(!e)return m;try{const a=c.default(e),i=n&&18!==n?K.pow(n):tt,r=a.mul(i).toString();return/\D/gm.test(r)?m:new t.BN(r)}catch(t){return m}},nt=(t,e)=>{if(!t)return"0";try{const n=c.default(t.toString()),a=e&&18!==e?K.pow(e):tt,i=n.div(a);return i.toString()}catch(t){return"0"}};class at{static async sendTokenFromParachainToMangataFee(...a){const[r,s,o,c,u,d,l]=a,y=new n.WsProvider(s),g=await new e.ApiPromise({provider:y,noInitWarn:!0}).isReady,w=i.encodeAddress(d,42),p=(await r.query.assetRegistry.metadata.entries()).filter((t=>JSON.stringify(t[1].toHuman()).includes(o)))[0];if(!Array.isArray(p)||!p.length)return"0";const m=JSON.parse(JSON.stringify(p[1].toJSON()));if(!m.location)return"0";const{location:T,decimals:N}=m,f=["BNC","vBNC","ZLK","vsKSM","vKSM","IMBU"];let h=null,x=null;f.includes(o)?(h={V2:{id:{Concrete:_(o,T)},fun:{Fungible:l}}},x={V2:{parents:1,interior:{X2:[{Parachain:2110},{AccountId32:{network:"Any",id:g.createType("AccountId32",w).toHex()}}]}}}):(h={V1:{id:{Concrete:{parents:"1",interior:T.v1.interior}},fun:{Fungible:l}}},x={V1:{parents:1,interior:{X2:[{Parachain:2110},{AccountId32:{network:"Any",id:g.createType("AccountId32",w).toHex()}}]}}});let A=null;A=f.includes(o)?{Limited:{refTime:new t.BN(c),proofSize:0}}:M(new t.BN(c),g.tx.xTokens.transferMultiasset);const k=await g.tx.xTokens.transferMultiasset(h,x,A).paymentInfo(u);return nt(new t.BN(k.partialFee.toString()),Number(N))}static async sendTokenFromMangataToParachainFee(...e){const[n,a,r,s,o,c,u]=e,d=i.encodeAddress(c,42),l=(await n.query.assetRegistry.metadata.entries()).filter((t=>JSON.stringify(t[1].toHuman()).includes(a)))[0];if(!Array.isArray(l)||!l.length)return"0";const y=l[0].toHuman()[0].replace(/[, ]/g,""),g={V1:{parents:1,interior:{X2:[{Parachain:s},{AccountId32:{network:"Any",id:n.createType("AccountId32",d).toHex()}}]}}},w=M(new t.BN(r),n.tx.xTokens.transfer),p=await n.tx.xTokens.transfer(y,u,g,w).paymentInfo(o);return nt(new t.BN(p.partialFee.toString()))}static async sendTurTokenFromTuringToMangataFee(a,r,s,o,c){const u=new n.WsProvider(r),d=await new e.ApiPromise({provider:u}).isReady,l=i.encodeAddress(o,42),y={V1:{id:{Concrete:{parents:1,interior:{X1:{Parachain:2114}}}},fun:{Fungible:c}}},g={V1:{parents:1,interior:{X2:[{Parachain:2110},{AccountId32:{network:"Any",id:a.createType("AccountId32",l).toHex()}}]}}},w=M(new t.BN("4000000000"),a.tx.xTokens.transferMultiasset),p=await d.tx.xTokens.transferMultiasset(y,g,w).paymentInfo(s);return nt(new t.BN(p.partialFee.toString()),10)}static async sendTurTokenFromMangataToTuringFee(e,n,a,r){const s=i.encodeAddress(a,42),o={V1:{parents:1,interior:{X2:[{Parachain:2114},{AccountId32:{network:"Any",id:e.createType("AccountId32",s).toHex()}}]}}},c=await e.tx.xTokens.transfer("7",r,o,new t.BN("6000000000")).paymentInfo(n);return nt(new t.BN(c.partialFee.toString()))}static async sendTokenFromStatemineToMangataFee(...a){const[r,s,o,c,u,d,l]=a,y=new n.WsProvider(s),g=await new e.ApiPromise({provider:y,noInitWarn:!0}).isReady,w=i.encodeAddress(d,42),p=(await r.query.assetRegistry.metadata.entries()).filter((t=>JSON.stringify(t[1].toHuman()).includes(o)))[0];if(!Array.isArray(p)||!p.length)return"0";const m=JSON.parse(JSON.stringify(p[1].toJSON()));if(!m.location)return"0";const{location:T}=m,N=await g.tx.polkadotXcm.limitedReserveTransferAssets({V3:{interior:{X1:{Parachain:2110}},parents:1}},{V3:{interior:{X1:{AccountId32:{id:g.createType("AccountId32",w).toHex()}}},parents:0}},{V3:[{fun:{Fungible:l},id:{Concrete:_(o,T)}}]},0,{Limited:{refTime:new t.BN(c),proofSize:0}}).paymentInfo(u);return nt(new t.BN(N.partialFee.toString()),12)}static async sendKusamaTokenFromRelayToParachainFee(a,i,r,s,o){const c=new n.WsProvider(a),u=await new e.ApiPromise({provider:c,noInitWarn:!0}).isReady,d=u.tx.xcmPallet.limitedReserveTransferAssets({V3:{parents:0,interior:{X1:{Parachain:o}}}},{V3:{parents:0,interior:{X1:{AccountId32:{id:u.createType("AccountId32",r).toHex()}}}}},{V3:[{id:{Concrete:{parents:0,interior:"Here"}},fun:{Fungible:s}}]},0,{Limited:{refTime:new t.BN("298368000"),proofSize:0}}),l=await d.paymentInfo(i);return nt(new t.BN(l.partialFee.toString()),12)}static async sendKusamaTokenFromParachainToRelayFee(e,n,a,r){const s={V1:{parents:1,interior:{X1:{AccountId32:{network:"Any",id:e.createType("AccountId32",i.encodeAddress(a,2)).toHex()}}}}},o=M(new t.BN("6000000000"),e.tx.xTokens.transferMultiasset),c=await e.tx.xTokens.transfer("4",r,s,o).paymentInfo(n);return nt(new t.BN(c.partialFee.toString()))}static async activateLiquidity(e,n,a,i){const r=await e.tx.xyk.activateLiquidityV2(a,i,null).paymentInfo(n);return nt(new t.BN(r.partialFee.toString()))}static async deactivateLiquidity(e,n,a,i){const r=await e.tx.xyk.deactivateLiquidityV2(a,i).paymentInfo(n);return nt(new t.BN(r.partialFee.toString()))}static async claimRewardsFee(e,n,a,i){const r=await e.tx.xyk.claimRewards(a).paymentInfo(n);return nt(new t.BN(r.partialFee.toString()))}static async createPoolFee(e,n,a,i,r,s){const o=await e.tx.xyk.createPool(a,i,r,s).paymentInfo(n);return nt(new t.BN(o.partialFee.toString()))}static async sellAssetFee(e,n,a,i,r,s){const o=await e.tx.xyk.sellAsset(a,i,r,s).paymentInfo(n);return nt(new t.BN(o.partialFee.toString()))}static async buyAssetFee(e,n,a,i,r,s){const o=await e.tx.xyk.buyAsset(a,i,r,s).paymentInfo(n);return nt(new t.BN(o.partialFee.toString()))}static async mintLiquidityFee(e,n,a,i,r,s=new t.BN(Number.MAX_SAFE_INTEGER)){const o=await e.tx.xyk.mintLiquidity(a,i,r,s).paymentInfo(n);return nt(new t.BN(o.partialFee.toString()))}static async burnLiquidityFee(e,n,a,i,r){const s=await e.tx.xyk.burnLiquidity(a,i,r).paymentInfo(n);return nt(new t.BN(s.partialFee.toString()))}static async transferTokenFee(e,n,a,i,r){const s=await e.tx.tokens.transfer(i,a,r).paymentInfo(n);return nt(new t.BN(s.partialFee.toString()))}static async transferAllTokenFee(e,n,a,i){const r=await e.tx.tokens.transferAll(i,a,!0).paymentInfo(n);return nt(new t.BN(r.partialFee.toString()))}}class it{api;urls;static instanceMap=new Map;constructor(t){this.urls=t,this.api=(async()=>await this.connectToNode(t))()}async connectToNode(t){const i=new n.WsProvider(t,5e3);return await e.ApiPromise.create(a.options({provider:i,throwOnConnect:!0,throwOnUnknown:!0,noInitWarn:!0}))}static getInstance(t){return it.instanceMap.has(JSON.stringify(t))||it.instanceMap.set(JSON.stringify(t),new it(t)),it.instanceMap.get(JSON.stringify(t))}async getApi(){return this.api||(this.api=this.connectToNode(this.urls)),this.api}getUrls(){return this.urls}async waitForNewBlock(t){let e=0;const n=await this.getApi(),a=t||2;return new Promise((async t=>{const i=await n.rpc.chain.subscribeNewHeads((()=>{++e===a&&(i(),t(!0))}))}))}async getChain(){const t=await this.getApi();return u.getChain(t)}async getNodeName(){const t=await this.getApi();return u.getNodeName(t)}async getNodeVersion(){const t=await this.getApi();return u.getNodeVersion(t)}async getNonce(t){const e=await this.getApi();return R.getNonce(e,t)}async disconnect(){const t=await this.getApi();await t.disconnect()}async sendTokenFromStatemineToMangataFee(t,e,n,a,i,r){const s=await this.getApi();return await at.sendTokenFromStatemineToMangataFee(s,t,e,n,a,i,r)}async sendTokenFromStatemineToMangata(t,e,n,a,i,r,s){const o=await this.getApi();return await J.sendTokenFromStatemineToMangata(o,t,e,n,a,i,r,s)}async sendTokenFromParachainToMangata(t,e,n,a,i,r,s){const o=await this.getApi();return await J.sendTokenFromParachainToMangata(o,t,e,n,a,i,r,s)}async sendTokenFromMangataToParachain(t,e,n,a,i,r,s){const o=await this.getApi();return await J.sendTokenFromMangataToParachain(o,t,e,n,a,i,r,s)}async sendTokenFromParachainToMangataFee(t,e,n,a,i,r){const s=await this.getApi();return await at.sendTokenFromParachainToMangataFee(s,t,e,n,a,i,r)}async sendTokenFromMangataToParachainFee(t,e,n,a,i,r){const s=await this.getApi();return await at.sendTokenFromMangataToParachainFee(s,t,e,n,a,i,r)}async sendKusamaTokenFromRelayToParachain(t,e,n,a,i=2110,r){return await J.sendKusamaTokenFromRelayToParachain(t,e,n,a,i,r)}async sendKusamaTokenFromRelayToParachainFee(t,e,n,a,i=2110){return await at.sendKusamaTokenFromRelayToParachainFee(t,e,n,a,i)}async sendKusamaTokenFromParachainToRelay(t,e,n,a){const i=await this.getApi();return await J.sendKusamaTokenFromParachainToRelay(i,t,e,n,a)}async sendKusamaTokenFromParachainToRelayFee(t,e,n){const a=await this.getApi();return await at.sendKusamaTokenFromParachainToRelayFee(a,t,e,n)}async sendTurTokenFromTuringToMangata(t,e,n,a,i){const r=await this.getApi();return await J.sendTurTokenFromTuringToMangata(r,t,e,n,a,i)}async sendTurTokenFromMangataToTuring(t,e,n,a){const i=await this.getApi();return await J.sendTurTokenFromMangataToTuring(i,t,e,n,a)}async sendTurTokenFromTuringToMangataFee(t,e,n,a){const i=await this.getApi();return await at.sendTurTokenFromTuringToMangataFee(i,t,e,n,a)}async sendTurTokenFromMangataToTuringFee(t,e,n){const a=await this.getApi();return await at.sendTurTokenFromMangataToTuringFee(a,t,e,n)}async activateLiquidity(t,e,n,a){const i=await this.getApi();return await J.activateLiquidity(i,t,e,n,a)}async deactivateLiquidity(t,e,n,a){const i=await this.getApi();return await J.deactivateLiquidity(i,t,e,n,a)}async calculateFutureRewardsAmountForMinting(e,n,a){const i=await this.getApi();return await(async(e,n,a,i)=>{const r=new t.BN("136986000000000000000000"),s=i.div(new t.BN("1200")).mul(r),o=(await e.query.issuance.promotedPoolsRewardsV2()).toHuman(),c=Object.values(o).reduce(((e,n)=>e.add(new t.BN(n.weight))),new t.BN(0)),u=new t.BN(o[n].weight.toString()),d=s.mul(u).div(c),l=await e.query.proofOfStake.liquidityMiningActivePoolV2(n);return d.mul(a).div(new t.BN(l.toString()).add(a))})(i,e,n,a)}async calculateRewardsAmount(t,e){const n=await this.getApi();return await u.calculateRewardsAmount(n,t,e)}async claimRewardsFee(t,e,n){const a=await this.getApi();return await at.claimRewardsFee(a,t,e,n)}async claimRewards(t,e,n,a){const i=await this.getApi();return await J.claimRewards(i,t,e,n,a)}async createPoolFee(t,e,n,a,i){const r=await this.getApi();return await at.createPoolFee(r,t,e,n,a,i)}async createPool(t,e,n,a,i,r){const s=await this.getApi();return await J.createPool(s,t,e,n,a,i,r)}async sellAssetFee(t,e,n,a,i){const r=await this.getApi();return await at.sellAssetFee(r,t,e,n,a,i)}async sellAsset(t,e,n,a,i,r){const s=await this.getApi();return await J.sellAsset(s,t,e,n,a,i,r)}async mintLiquidityFee(t,e,n,a,i){const r=await this.getApi();return await at.mintLiquidityFee(r,t,e,n,a,i)}async mintLiquidity(t,e,n,a,i,r){const s=await this.getApi();return await J.mintLiquidity(s,t,e,n,a,i,r)}async burnLiquidityFee(t,e,n,a){const i=await this.getApi();return await at.burnLiquidityFee(i,t,e,n,a)}async burnLiquidity(t,e,n,a,i){const r=await this.getApi();return await J.burnLiquidity(r,t,e,n,a,i)}async buyAssetFee(t,e,n,a,i){const r=await this.getApi();return await at.buyAssetFee(r,t,e,n,a,i)}async buyAsset(t,e,n,a,i,r){const s=await this.getApi();return await J.buyAsset(s,t,e,n,a,i,r)}async calculateBuyPrice(t,e,n){const a=await this.getApi();return await u.calculateBuyPrice(a,t,e,n)}async calculateSellPrice(t,e,n){const a=await this.getApi();return await u.calculateSellPrice(a,t,e,n)}async getBurnAmount(t,e,n){const a=await this.getApi();return await u.getBurnAmount(a,t,e,n)}async calculateSellPriceId(t,e,n){const a=await this.getApi();return await u.calculateSellPriceId(a,t,e,n)}async calculateBuyPriceId(t,e,n){const a=await this.getApi();return await u.calculateBuyPriceId(a,t,e,n)}async getAmountOfTokenIdInPool(t,e){const n=await this.getApi();return await R.getAmountOfTokenIdInPool(n,t,e)}async getLiquidityTokenId(t,e){const n=await this.getApi();return await R.getLiquidityTokenId(n,t,e)}async getLiquidityPool(t){const e=await this.getApi();return await R.getLiquidityPool(e,t)}async transferTokenFee(t,e,n,a){const i=await this.getApi();return await at.transferTokenFee(i,t,e,n,a)}async transferToken(t,e,n,a,i){const r=await this.getApi();return await J.transferToken(r,t,e,n,a,i)}async transferTokenAllFee(t,e,n){const a=await this.getApi();return await at.transferAllTokenFee(a,t,e,n)}async transferTokenAll(t,e,n,a){const i=await this.getApi();return await J.transferAllToken(i,t,e,n,a)}async getTotalIssuance(t){const e=await this.getApi();return await R.getTotalIssuance(e,t)}async getTokenBalance(t,e){const n=await this.getApi();return await R.getTokenBalance(n,e,t)}async getNextTokenId(){const t=await this.getApi();return await R.getNextTokenId(t)}async getTokenInfo(t){const e=await this.getApi();return await R.getTokenInfo(e,t)}async getBlockNumber(){const t=await this.getApi();return await R.getBlockNumber(t)}async getOwnedTokens(t){const e=await this.getApi();return await R.getOwnedTokens(e,t)}async getLiquidityTokenIds(){const t=await this.getApi();return await R.getLiquidityTokenIds(t)}async getAssetsInfo(){const t=await this.getApi();return await R.getAssetsInfo(t)}async getBalances(){const t=await this.getApi();return await R.getBalances(t)}async getLiquidityTokens(){const t=await this.getApi();return await R.getLiquidityTokens(t)}async getPool(t){const e=await this.getApi();return await R.getPool(e,t)}async getInvestedPools(t){const e=await this.getApi();return await R.getInvestedPools(e,t)}async getPools(){const t=await this.getApi();return await R.getPools(t)}}const rt=(t,e)=>{const n=new RegExp(`^-?\\d+(?:\\.\\d{0,${e}})?`,"gm"),a=t.match(n),i=(a?.[0]||t).match(/^-?0*(\d+(?:\.(?:(?!0+$)\d)+)?)/gm);return i?.[0]??t},st=t=>{const e=+t;return!(!t||isNaN(Number(t))||isNaN(e)||e<0)};Object.defineProperty(exports,"BN",{enumerable:!0,get:function(){return t.BN}}),exports.BIG_BILLION=Z,exports.BIG_HUNDRED=U,exports.BIG_HUNDRED_BILLIONS=Q,exports.BIG_HUNDRED_MILLIONS=j,exports.BIG_HUNDRED_THOUSAND=C,exports.BIG_MILLION=W,exports.BIG_ONE=D,exports.BIG_TEN=K,exports.BIG_TEN_BILLIONS=z,exports.BIG_TEN_MILLIONS=G,exports.BIG_TEN_THOUSAND=X,exports.BIG_THOUSAND=$,exports.BIG_TRILLION=Y,exports.BIG_ZERO=V,exports.BN_BILLION=I,exports.BN_DIV_NUMERATOR_MULTIPLIER=b,exports.BN_DIV_NUMERATOR_MULTIPLIER_DECIMALS=18,exports.BN_HUNDRED=f,exports.BN_HUNDRED_BILLIONS=P,exports.BN_HUNDRED_MILLIONS=B,exports.BN_HUNDRED_THOUSAND=A,exports.BN_MILLION=k,exports.BN_ONE=T,exports.BN_TEN=N,exports.BN_TEN_BILLIONS=F,exports.BN_TEN_MILLIONS=S,exports.BN_TEN_THOUSAND=x,exports.BN_THOUSAND=h,exports.BN_TRILLION=O,exports.BN_ZERO=m,exports.Mangata=it,exports.MangataHelpers=class{static createKeyring(t){return new e.Keyring({type:t})}static createKeyPairFromName(t,e=""){const n=e||"//testUser_"+s.v4(),a=t.createFromUri(n);return t.addPair(a),a}static getPriceImpact(t,e,n,a){if(!(t&&e&&st(n)&&st(a)))return;const i=t.firstTokenBalance,r=t.secondTokenBalance,s=et(n,e.firstTokenDecimals),o=et(a,e.secondTokenDecimals);if(o.gte(r))return"";const u=i.add(s).mul(x).mul(r),d=r.sub(o).mul(i),l=u.div(d).sub(x).toString(),y=c.default(l);return rt(y.div(U).toString(),2)}},exports.fromBN=nt,exports.isBuyAssetTransactionSuccessful=t=>{const e=t.filter((t=>"ExtrinsicSuccess"===t.method)).length,n=t.filter((t=>"BuyAssetFailedDueToSlippage"===t.method)).length;return 1===e&&0===n},exports.isSellAssetTransactionSuccessful=t=>{const e=t.filter((t=>"ExtrinsicSuccess"===t.method)).length,n=t.filter((t=>"SellAssetFailedDueToSlippage"===t.method)).length;return 1===e&&0===n},exports.signTx=H,exports.toBN=et,exports.toFixed=rt;
