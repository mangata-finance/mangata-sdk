"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var t=require("@polkadot/util"),e=require("@moonbeam-network/xcm-config"),n=require("@moonbeam-network/xcm-sdk"),a=require("@polkadot/api"),i=require("@polkadot/rpc-provider/ws"),r=require("@mangata-finance/types"),s=require("@polkadot/util-crypto"),o=require("big.js"),c=require("uuid");function u(t){return t&&"object"==typeof t&&"default"in t?t:{default:t}}var d=u(o);class l{static async getChain(t){return(await t.rpc.system.chain()).toHuman()}static async getNodeName(t){return(await t.rpc.system.name()).toHuman()}static async getNodeVersion(t){return(await t.rpc.system.version()).toHuman()}static async calculateRewardsAmount(e,n,a){const i=await e.rpc.xyk.calculate_rewards_amount(n,a);return t.isHex(i.price.toString())?t.hexToBn(i.price.toString()):new t.BN(i.price)}static async calculateBuyPrice(e,n,a,i){const r=await e.rpc.xyk.calculate_buy_price(n,a,i);return new t.BN(r.price)}static async calculateSellPrice(e,n,a,i){const r=await e.rpc.xyk.calculate_sell_price(n,a,i);return new t.BN(r.price)}static async getBurnAmount(t,e,n,a){const i=await t.rpc.xyk.get_burn_amount(e,n,a);return JSON.parse(i.toString())}static async calculateSellPriceId(e,n,a,i){const r=await e.rpc.xyk.calculate_sell_price_id(n,a,i);return new t.BN(r.price)}static async calculateBuyPriceId(e,n,a,i){const r=await e.rpc.xyk.calculate_buy_price_id(n,a,i);return new t.BN(r.price)}}class y{static instance;db={};constructor(){}static getInstance(){return y.instance||(y.instance=new y),y.instance}hasAddressNonce=t=>!!this.db[t];setNonce=(t,e)=>{this.db[t]=e};getNonce=t=>this.db[t]}const g=y.getInstance(),w=async e=>(await e.query.assetRegistry.metadata.entries()).reduce(((e,[n,a])=>{const i=n.toHuman()[0].replace(/[, ]/g,""),r=a.toHuman(),{name:s,decimals:o,symbol:c}=r,u={id:i,chainId:0,decimals:Number(o.toString()),name:s,symbol:c,address:"MGA"===t.hexToString(c.toString())?"0xc7e3bda797d2ceb740308ec40142ae235e08144a":"ETH"===t.hexToString(c.toString())?"0x0000000000000000000000000000000000000000":""};return e[i]=u,e}),{}),p=async t=>(await t.query.xyk.liquidityAssets.entries()).reduce(((t,[e,n])=>{const a=e.args.map((t=>t.toHuman()))[0],i=n.toString().replace(/[, ]/g,"");return t[a]=i,t}),{}),m=async(e,n)=>(await e.query.tokens.accounts.entries(n)).reduce(((e,[n,a])=>{const i=JSON.parse(JSON.stringify(a)).free.toString(),r=JSON.parse(JSON.stringify(a)).frozen.toString(),s=JSON.parse(JSON.stringify(a)).reserved.toString(),o={free:t.isHex(i)?t.hexToBn(i):new t.BN(i),frozen:t.isHex(r)?t.hexToBn(r):new t.BN(r),reserved:t.isHex(s)?t.hexToBn(s):new t.BN(s)};return e[n.toHuman()[1].replace(/[, ]/g,"")]=o,e}),{}),T=async e=>{const n=await w(e);return Object.values(n).filter((t=>"1"!==t.id&&"3"!==t.id)).reduce(((e,n)=>{const a={...n,name:n.name.replace(/0x\w+/,"").replace(/[A-Z]/g," $&").trim(),symbol:n.symbol.includes("TKN")?n.symbol.split("-").reduce(((e,n)=>{const a=n.replace("TKN",""),i=a.startsWith("0x")?t.hexToBn(a).toString():a;return e.push(i),e}),[]).join("-"):n.symbol};return e[a.id]=a,e}),{})},N=new t.BN("0"),f=new t.BN("1"),h=new t.BN("10"),A=new t.BN("100"),k=new t.BN("1000"),x=new t.BN("10000"),S=new t.BN("100000"),B=new t.BN("1000000"),I=new t.BN("10000000"),F=new t.BN("100000000"),P=new t.BN("1000000000"),O=new t.BN("10000000000"),v=new t.BN("100000000000"),L=new t.BN("1000000000000"),b=new t.BN("10").pow(new t.BN(18)),q=(t,e)=>e.gt(N)?q(e,t.mod(e)):t,R=(t,e)=>{const n=((t,e)=>{const n=q(t,e);return n.isZero()?[N,N]:[t.div(n),e.div(n)]})(t,e);return n[1].mul(b).div(n[0])},M=async t=>{try{const e=(await t.query.proofOfStake.promotedPoolRewards()).toHuman();return Object.keys(e)}catch(t){return[]}};class _{static async getNonce(t,e){return(await t.rpc.system.accountNextIndex(e)).toBn()}static async getAmountOfTokenIdInPool(e,n,a){const i=JSON.parse(JSON.stringify(await e.query.xyk.pools([n,a])));return[t.isHex(i[0])?t.hexToBn(i[0]):new t.BN(i[0]),t.isHex(i[1])?t.hexToBn(i[1]):new t.BN(i[1])]}static async getLiquidityTokenId(e,n,a){const i=await e.query.xyk.liquidityAssets([n,a]);return i?new t.BN(i.toString()):t.BN_ZERO}static async getLiquidityPool(e,n){const a=JSON.parse(JSON.stringify(await e.query.xyk.liquidityPools(n)));return a?a.map((e=>new t.BN(e))):[new t.BN(-1),new t.BN(-1)]}static async getTotalIssuance(e,n){const a=await e.query.tokens.totalIssuance(n);return new t.BN(a.toString())}static async getTokenBalance(e,n,a){const{free:i,reserved:r,frozen:s}=JSON.parse(JSON.stringify(await e.query.tokens.accounts(n,a)));return{free:t.isHex(i.toString())?t.hexToBn(i.toString()):new t.BN(i.toString()),reserved:t.isHex(r.toString())?t.hexToBn(r.toString()):new t.BN(r.toString()),frozen:t.isHex(s.toString())?t.hexToBn(s.toString()):new t.BN(s.toString())}}static async getNextTokenId(e){const n=await e.query.tokens.nextCurrencyId();return new t.BN(n.toString())}static async getTokenInfo(t,e){return(await this.getAssetsInfo(t))[e]}static async getLiquidityTokenIds(t){return(await t.query.xyk.liquidityAssets.entries()).map((t=>t[1].toString()))}static async getLiquidityTokens(t){const e=await this.getAssetsInfo(t);return Object.values(e).reduce(((t,e)=>(e.name.includes("Liquidity Pool Token")&&(t[e.id]=e),t)),{})}static async getAssetsInfo(e){const n=await w(e);return Object.values(n).filter((t=>!["1","3"].includes(t.id))).reduce(((e,a)=>{const i={...a,name:a.name.replace(/0x\w+/,"").replace(/[A-Z]/g,"$&").trim(),symbol:a.symbol.includes("TKN")?a.symbol.split("-").reduce(((e,a)=>{const i=a.replace("TKN",""),r=i.startsWith("0x")?t.hexToBn(i).toString():i,s=n[r].symbol;return e.push(s),e}),[]).join("-"):a.symbol};return e[i.id]=i,e}),{})}static async getBlockNumber(t){return(await t.rpc.chain.getBlock()).block.header.number.toString()}static async getOwnedTokens(t,e){if(!e)return null;const[n,a]=await Promise.all([this.getAssetsInfo(t),m(t,e)]);return Object.values(n).reduce(((t,e)=>(Object.keys(a).includes(e.id)&&(t[e.id]={...e,balance:a[e.id]}),t)),{})}static async getBalances(e){return(await e.query.tokens.totalIssuance.entries()).reduce(((e,[n,a])=>{const i=n.toHuman()[0].replace(/[, ]/g,""),r=new t.BN(a.toString());return e[i]=r,e}),{})}static async getInvestedPools(e,n){const[a,i,r]=await Promise.all([T(e),m(e,n),M(e)]),s=Object.values(a).reduce(((t,e)=>(Object.keys(i).includes(e.id)&&e.name.includes("Liquidity Pool Token")&&t.push(e),t)),[]).map((async n=>{const a=i[n.id],s=n.symbol.split("-")[0],o=n.symbol.split("-")[1],[c,u]=await this.getAmountOfTokenIdInPool(e,s.toString(),o.toString()),d=await(async(e,n,a)=>{if(a.isZero())return N;const i=await e.query.tokens.totalIssuance(n),r=new t.BN(i.toString());return a.mul(b).div(r)})(e,n.id,a.free.add(a.reserved));return{firstTokenId:s,secondTokenId:o,firstTokenAmount:c,secondTokenAmount:u,liquidityTokenId:n.id,isPromoted:r.includes(n.id),share:d,firstTokenRatio:d.eq(t.BN_ZERO)?t.BN_ZERO:R(c,u),secondTokenRatio:d.eq(t.BN_ZERO)?t.BN_ZERO:R(u,c),activatedLPTokens:a.reserved,nonActivatedLPTokens:a.free}}));return Promise.all(s)}static async getPool(t,e){const n=await this.getLiquidityPool(t,e),a=(await t.query.proofOfStake.promotedPoolRewards()).toHuman()[e],[i,r]=n,[s,o]=await this.getAmountOfTokenIdInPool(t,i.toString(),r.toString());return{firstTokenId:i.toString(),secondTokenId:r.toString(),firstTokenAmount:s,secondTokenAmount:o,liquidityTokenId:e,isPromoted:!!a,firstTokenRatio:R(s,o),secondTokenRatio:R(o,s)}}static async getPools(e){const[n,a]=await Promise.all([T(e),p(e)]),i=await(async(e,n)=>(await e.query.xyk.pools.entries()).reduce(((e,[a,i])=>{const r=a.args.map((t=>t.toHuman()))[0],s=JSON.parse(JSON.stringify(i)).map((e=>t.isHex(e)?t.hexToBn(e):new t.BN(e)));return e[n[r]]=s,e}),{}))(e,a),r=await M(e);return Object.values(n).reduce(((t,e)=>Object.values(a).includes(e.id)?t.concat(e):t),[]).map((t=>{const[e,n]=i[t.id];return{firstTokenId:t.symbol.split("-")[0],secondTokenId:t.symbol.split("-")[1],firstTokenAmount:e,secondTokenAmount:n,liquidityTokenId:t.id,firstTokenRatio:R(e,n),secondTokenRatio:R(n,e),isPromoted:r.includes(t.id)}}))}}const H=(t,e)=>e?.meta.args.at(-1)?.type.eq("XcmV2WeightLimit")?{Limited:t}:t,E=(t,e)=>"BNC"===t?{parents:"0",interior:{x1:{generalKey:{length:2,data:"0x0001000000000000000000000000000000000000000000000000000000000000"}}}}:"vBNC"===t?{parents:"0",interior:{x1:{generalKey:{length:2,data:"0x0101000000000000000000000000000000000000000000000000000000000000"}}}}:"ZLK"===t?{parents:"0",interior:{x1:{generalKey:{length:2,data:"0x0207000000000000000000000000000000000000000000000000000000000000"}}}}:"vsKSM"===t?{parents:"0",interior:{x1:{generalKey:{length:2,data:"0x0404000000000000000000000000000000000000000000000000000000000000"}}}}:"vKSM"===t?{parents:"0",interior:{x1:{generalKey:{length:2,data:"0x0104000000000000000000000000000000000000000000000000000000000000"}}}}:"USDT"===t?{parents:"0",interior:{x2:[{PalletInstance:50},{GeneralIndex:1984}]}}:"RMRK"===t?{parents:"0",interior:{x2:[{PalletInstance:50},{GeneralIndex:8}]}}:{interior:e.v3.interior};const J=async(t,e,n,a)=>new Promise((async(i,r)=>{const s="string"==typeof n?n:n.address;let o=!1;const c=await(async(t,e,n)=>{let a;if(n&&n.nonce)a=n.nonce;else{const n=await _.getNonce(t,e);a=g.hasAddressNonce(e)?g.getNonce(e):n,n&&n.gt(a)&&(a=n);const i=a.addn(1);g.setNonce(e,i)}return a})(t,s,a);try{await e.signAsync(n,{nonce:c,signer:a?.signer})}catch(t){r(t)}console.info(`submitting Tx[${e.hash.toString()}]who: ${s} nonce: ${c.toString()} `);try{const n=await e.send((async u=>{if(console.info(`Tx[${e.hash.toString()}]who: ${s} nonce: ${c.toString()} => ${u.status.type}(${u.status.value.toString()})${function(t,e){if(!process.env.TX_VERBOSE)return"";const n=JSON.parse(e.method.toString()),a=JSON.stringify(n.args),i=t.registry.findMetaCall(e.method.callIndex);if("sudo"==i.method&&"sudo"==i.method){const a=e.method.args[0].callIndex,i=JSON.stringify(n.args.call.args),r=t.registry.findMetaCall(a);return` (sudo:: ${r.section}:: ${r.method}(${i})`}return` (${i.section}:: ${i.method}(${a}))`}(t,e)}`),a?.statusCallback?.(u),!u.status.isInBlock&&!u.status.isFinalized||o){if(u.isError){console.info("Transaction Error Result",JSON.stringify(u,null,2)),r(`Tx([${e.hash.toString()}]) Transaction error`);const n=await _.getNonce(t,s);g.setNonce(s,n)}}else{let d;o=!0,u.status.isInBlock?d=u.status.asInBlock.toString():u.status.isFinalized&&(d=u.status.asFinalized.toString());const l=(await t.rpc.chain.getHeader(d)).number.toBn(),y=l.addn(0),w=l.addn(10),p=y,m=await t.rpc.chain.subscribeNewHeads((async o=>{const u=o.number.toBn();if(p.gt(w)){m(),r(`Tx([${e.hash.toString()}])\n                      was not executed in blocks : ${y.toString()}..${w.toString()}`);const a=await _.getNonce(t,s);return g.setNonce(s,a),void n()}if(u.gte(p)){const r=await t.rpc.chain.getBlockHash(p),o=await t.rpc.chain.getHeader(r),u=(await t.rpc.chain.getBlock(o.hash)).block.extrinsics,d=await t.at(o.hash),l=await d.query.system.events();p.iaddn(1);const y=u.findIndex((t=>t.hash.toString()===e.hash.toString()));if(y<0)return void console.info(`Tx([${e.hash.toString()}]) not found in block ${p} $([${(t=>{if(!t)return"";const e=t.length;return t.substring(0,7)+"..."+t.substring(e-5,e)})(r.toString())}])`);m(),console.info(`Tx[${e.hash.toString()}]who:${s} nonce:${c.toString()} => Executed(${r.toString()})`);const g=l.filter((t=>t.phase.isApplyExtrinsic&&t.phase.asApplyExtrinsic.toNumber()===y)).map((e=>{const{event:n,phase:a}=e,i=n.typeDef,r=n.data.map(((t,e)=>({lookupName:i[e].lookupName,data:t})));return{event:n,phase:a,section:n.section,method:n.method,metaDocumentation:n.meta.docs.toString(),eventData:r,error:D(t,n.method,r)}}));a?.extrinsicStatus?.(g),i(g),n()}}))}}))}catch(e){const n=await _.getNonce(t,s);g.setNonce(s,n),r({data:e.message||e.description||e.data?.toString()||e.toString()})}})),D=(e,n,a)=>{if("ExtrinsicFailed"===n){const n=a.find((t=>t.lookupName.includes("DispatchError"))),i=n?.data?.toHuman?.(),r=i?.Module?.error,s=i?.Module?.index;if(!r||!s)return{documentation:["Unknown error"],name:"UnknownError"};try{const n=e.registry.findMetaError({error:t.isHex(r)?t.hexToU8a(r):new t.BN(r),index:new t.BN(s)});return{documentation:n.docs,name:n.name}}catch(t){return{documentation:["Unknown error"],name:"UnknownError"}}}return null};class K{static async sendKusamaTokenFromRelayToParachain(e,n,r,s,o,c){const u=new i.WsProvider(e),d=await new a.ApiPromise({provider:u,noInitWarn:!0}).isReady;await d.tx.xcmPallet.limitedReserveTransferAssets({V3:{parents:0,interior:{X1:{Parachain:o}}}},{V3:{parents:0,interior:{X1:{AccountId32:{id:d.createType("AccountId32",r).toHex()}}}}},{V3:[{id:{Concrete:{parents:0,interior:"Here"}},fun:{Fungible:s}}]},0,{Limited:{refTime:new t.BN("298368000"),proofSize:0}}).signAndSend(n,{signer:c?.signer,nonce:c?.nonce})}static async sendKusamaTokenFromParachainToRelay(e,n,a,i,r){const s={V3:{parents:1,interior:{X1:{AccountId32:{id:e.createType("AccountId32",a).toHex()}}}}},o={Limited:{refTime:new t.BN("6000000000"),proofSize:0}};await e.tx.xTokens.transfer("4",i,s,o).signAndSend(n,{signer:r?.signer,nonce:r?.nonce})}static async sendTokenFromStatemineToMangata(...e){const[n,r,o,c,u,d,l,y]=e,g=new i.WsProvider(r),w=await new a.ApiPromise({provider:g,noInitWarn:!0}).isReady,p=s.encodeAddress(d,42),m=(await n.query.assetRegistry.metadata.entries()).filter((t=>JSON.stringify(t[1].toHuman()).includes(o)))[0],T=JSON.parse(JSON.stringify(m[1].toJSON()));T&&T.location&&await w.tx.polkadotXcm.limitedReserveTransferAssets({V3:{interior:{X1:{Parachain:2110}},parents:1}},{V3:{interior:{X1:{AccountId32:{id:w.createType("AccountId32",p).toHex()}}},parents:0}},{V3:[{fun:{Fungible:l},id:{Concrete:E(o,T.location)}}]},0,{Limited:{refTime:new t.BN(c),proofSize:0}}).signAndSend(u,{signer:y?.signer,nonce:y?.nonce})}static async sendTokenFromParachainToMangata(...e){const[n,r,o,c,u,d,l,y]=e,g=new i.WsProvider(r),w=await new a.ApiPromise({provider:g,noInitWarn:!0}).isReady,p=s.encodeAddress(d,42),m=(await n.query.assetRegistry.metadata.entries()).filter((t=>JSON.stringify(t[1].toHuman()).includes(o)))[0],T=JSON.parse(JSON.stringify(m[1].toJSON()));if(T&&T.location){let e=null;e=["BNC","vBNC","ZLK","vsKSM","vKSM"].includes(o)?E(o,T.location):{parents:1,interior:T.location.v3.interior};const n={V3:{id:{Concrete:e},fun:{Fungible:l}}},a={V3:{parents:1,interior:{X2:[{Parachain:2110},{AccountId32:{id:w.createType("AccountId32",p).toHex()}}]}}},i={Limited:{refTime:new t.BN(c),proofSize:0}};await w.tx.xTokens.transferMultiasset(n,a,i).signAndSend(u,{signer:y?.signer,nonce:y?.nonce})}}static async sendTokenFromMangataToParachain(...e){const[n,a,i,r,o,c,u,d]=e,l=s.encodeAddress(c,42),y=(await n.query.assetRegistry.metadata.entries()).filter((t=>JSON.stringify(t[1].toHuman()).includes(a)))[0],g=JSON.parse(JSON.stringify(y[1].toJSON()));if(g&&g.location){const e=y[0].toHuman()[0].replace(/[, ]/g,""),s={V3:{parents:1,interior:{X2:[{Parachain:r},{AccountId32:{id:n.createType("AccountId32",l).toHex()}}]}}};let c;c=["RMRK","USDT"].includes(a)?"Unlimited":{Limited:{ref_time:new t.BN(i),proof_size:0}},await J(n,n.tx.xTokens.transfer(e,u,s,c),o,d)}}static async sendTurTokenFromTuringToMangata(e,n,r,o,c,u){const d=new i.WsProvider(n),l=await new a.ApiPromise({provider:d}).isReady,y=s.encodeAddress(o,42),g={V1:{id:{Concrete:{parents:1,interior:{X1:{Parachain:2114}}}},fun:{Fungible:c}}},w={V1:{parents:1,interior:{X2:[{Parachain:2110},{AccountId32:{network:"Any",id:e.createType("AccountId32",y).toHex()}}]}}},p=H(new t.BN("4000000000"),e.tx.xTokens.transferMultiasset);await l.tx.xTokens.transferMultiasset(g,w,p).signAndSend(r,{signer:u?.signer,nonce:u?.nonce})}static async sendTurTokenFromMangataToTuring(e,n,a,i,r){const o=s.encodeAddress(a,42),c={V1:{parents:1,interior:{X2:[{Parachain:2114},{AccountId32:{network:"Any",id:e.createType("AccountId32",o).toHex()}}]}}};await J(e,e.tx.xTokens.transfer("7",i,c,new t.BN("6000000000")),n,r)}static async sendTokenFromMangataToMoonriver(e,n,a,i,r,s){const o=(await e.query.assetRegistry.metadata.entries()).filter((t=>JSON.stringify(t[1].toHuman()).includes(a)))[0][0].toHuman()[0].replace(/[, ]/g,""),c={V3:{parents:1,interior:{X2:[{Parachain:2023},{AccountKey20:{key:e.createType("AccountId20",i).toHex()}}]}}},u={Limited:{ref_time:new t.BN("1000000000"),proof_size:0}};await J(e,e.tx.xTokens.transfer(o,r,c,u),n,s)}static async activateLiquidity(t,e,n,a,i){return await J(t,t.tx.proofOfStake.activateLiquidity(n,a,null),e,i)}static async deactivateLiquidity(t,e,n,a,i){return await J(t,t.tx.proofOfStake.deactivateLiquidity(n,a),e,i)}static async claimRewardsAll(t,e,n,a){return await J(t,t.tx.proofOfStake.claimRewardsAll(n),e,a)}static async createPool(t,e,n,a,i,r,s){return await J(t,t.tx.xyk.createPool(n,a,i,r),e,s)}static async sellAsset(t,e,n,a,i,r,s){return await J(t,t.tx.xyk.sellAsset(n,a,i,r),e,s)}static async buyAsset(t,e,n,a,i,r,s){return await J(t,t.tx.xyk.buyAsset(n,a,i,r),e,s)}static async mintLiquidity(t,e,n,a,i,r,s){return await J(t,t.tx.xyk.mintLiquidity(n,a,i,r),e,s)}static async burnLiquidity(t,e,n,a,i,r){return await J(t,t.tx.xyk.burnLiquidity(n,a,i),e,r)}static async transferToken(t,e,n,a,i,r){return await J(t,t.tx.tokens.transfer(a,n,i),e,r)}static async transferAllToken(t,e,n,a,i){return await J(t,t.tx.tokens.transferAll(a,n,!0),e,i)}}const V=d.default("0"),U=d.default("1"),$=d.default("10"),X=d.default("100"),C=d.default("1000"),W=d.default("10000"),z=d.default("100000"),G=d.default("1000000"),j=d.default("10000000"),Z=d.default("100000000"),Q=d.default("1000000000"),Y=d.default("10000000000"),tt=d.default("100000000000"),et=d.default("1000000000000");d.default.PE=256,d.default.NE=-256,d.default.DP=40,d.default.RM=d.default.roundUp;const nt=$.pow(18),at=(e,n)=>{if(!e)return N;try{const a=d.default(e),i=n&&18!==n?$.pow(n):nt,r=a.mul(i).toString();return/\D/gm.test(r)?N:new t.BN(r)}catch(t){return N}},it=(t,e)=>{if(!t)return"0";try{const n=d.default(t.toString()),a=e&&18!==e?$.pow(e):nt,i=n.div(a);return i.toString()}catch(t){return"0"}};class rt{static async sendTokenFromParachainToMangataFee(...e){const[n,r,o,c,u,d,l]=e,y=new i.WsProvider(r),g=await new a.ApiPromise({provider:y,noInitWarn:!0}).isReady,w=s.encodeAddress(d,42),p=(await n.query.assetRegistry.metadata.entries()).filter((t=>JSON.stringify(t[1].toHuman()).includes(o)))[0];if(!Array.isArray(p)||!p.length)return"0";const m=JSON.parse(JSON.stringify(p[1].toJSON()));if(!m.location)return"0";const{decimals:T}=m;let N=null;N=["BNC","vBNC","ZLK","vsKSM","vKSM"].includes(o)?E(o,m.location):{parents:1,interior:m.location.v3.interior};const f={V3:{id:{Concrete:N},fun:{Fungible:l}}},h={V3:{parents:1,interior:{X2:[{Parachain:2110},{AccountId32:{id:g.createType("AccountId32",w).toHex()}}]}}},A={Limited:{refTime:new t.BN(c),proofSize:0}},k=await g.tx.xTokens.transferMultiasset(f,h,A).paymentInfo(u);return it(new t.BN(k.partialFee.toString()),Number(T))}static async sendTokenFromMangataToParachainFee(...e){const[n,a,i,r,o,c,u]=e,d=s.encodeAddress(c,42),l=(await n.query.assetRegistry.metadata.entries()).filter((t=>JSON.stringify(t[1].toHuman()).includes(a)))[0];if(!Array.isArray(l)||!l.length)return"0";const y=l[0].toHuman()[0].replace(/[, ]/g,""),g={V3:{parents:1,interior:{X2:[{Parachain:r},{AccountId32:{id:n.createType("AccountId32",d).toHex()}}]}}};let w;w=["RMRK","USDT"].includes(a)?"Unlimited":{Limited:{ref_time:new t.BN(i),proof_size:0}};const p=await n.tx.xTokens.transfer(y,u,g,w).paymentInfo(o);return it(new t.BN(p.partialFee.toString()))}static async sendTurTokenFromTuringToMangataFee(e,n,r,o,c){const u=new i.WsProvider(n),d=await new a.ApiPromise({provider:u}).isReady,l=s.encodeAddress(o,42),y={V1:{id:{Concrete:{parents:1,interior:{X1:{Parachain:2114}}}},fun:{Fungible:c}}},g={V1:{parents:1,interior:{X2:[{Parachain:2110},{AccountId32:{network:"Any",id:e.createType("AccountId32",l).toHex()}}]}}},w=H(new t.BN("4000000000"),e.tx.xTokens.transferMultiasset),p=await d.tx.xTokens.transferMultiasset(y,g,w).paymentInfo(r);return it(new t.BN(p.partialFee.toString()),10)}static async sendTurTokenFromMangataToTuringFee(e,n,a,i){const r=s.encodeAddress(a,42),o={V1:{parents:1,interior:{X2:[{Parachain:2114},{AccountId32:{network:"Any",id:e.createType("AccountId32",r).toHex()}}]}}},c=await e.tx.xTokens.transfer("7",i,o,new t.BN("6000000000")).paymentInfo(n);return it(new t.BN(c.partialFee.toString()))}static async sendTokenFromStatemineToMangataFee(...e){const[n,r,o,c,u,d,l]=e,y=new i.WsProvider(r),g=await new a.ApiPromise({provider:y,noInitWarn:!0}).isReady,w=s.encodeAddress(d,42),p=(await n.query.assetRegistry.metadata.entries()).filter((t=>JSON.stringify(t[1].toHuman()).includes(o)))[0];if(!Array.isArray(p)||!p.length)return"0";const m=JSON.parse(JSON.stringify(p[1].toJSON()));if(!m.location)return"0";const{location:T}=m,N=await g.tx.polkadotXcm.limitedReserveTransferAssets({V3:{interior:{X1:{Parachain:2110}},parents:1}},{V3:{interior:{X1:{AccountId32:{id:g.createType("AccountId32",w).toHex()}}},parents:0}},{V3:[{fun:{Fungible:l},id:{Concrete:E(o,T)}}]},0,{Limited:{refTime:new t.BN(c),proofSize:0}}).paymentInfo(u);return it(new t.BN(N.partialFee.toString()),12)}static async sendKusamaTokenFromRelayToParachainFee(e,n,r,s,o){const c=new i.WsProvider(e),u=await new a.ApiPromise({provider:c,noInitWarn:!0}).isReady,d=u.tx.xcmPallet.limitedReserveTransferAssets({V3:{parents:0,interior:{X1:{Parachain:o}}}},{V3:{parents:0,interior:{X1:{AccountId32:{id:u.createType("AccountId32",r).toHex()}}}}},{V3:[{id:{Concrete:{parents:0,interior:"Here"}},fun:{Fungible:s}}]},0,{Limited:{refTime:new t.BN("298368000"),proofSize:0}}),l=await d.paymentInfo(n);return it(new t.BN(l.partialFee.toString()),12)}static async sendKusamaTokenFromParachainToRelayFee(e,n,a,i){const r={V3:{parents:1,interior:{X1:{AccountId32:{id:e.createType("AccountId32",a).toHex()}}}}},s={Limited:{refTime:new t.BN("6000000000"),proofSize:0}},o=await e.tx.xTokens.transfer("4",i,r,s).paymentInfo(n);return it(new t.BN(o.partialFee.toString()))}static async activateLiquidity(e,n,a,i){const r=await e.tx.proofOfStake.activateLiquidity(a,i,null).paymentInfo(n);return it(new t.BN(r.partialFee.toString()))}static async deactivateLiquidity(e,n,a,i){const r=await e.tx.proofOfStake.deactivateLiquidity(a,i).paymentInfo(n);return it(new t.BN(r.partialFee.toString()))}static async claimRewardsAllFee(e,n,a){const i=await e.tx.proofOfStake.claimRewardsAll(a).paymentInfo(n);return it(new t.BN(i.partialFee.toString()))}static async createPoolFee(e,n,a,i,r,s){const o=await e.tx.xyk.createPool(a,i,r,s).paymentInfo(n);return it(new t.BN(o.partialFee.toString()))}static async sellAssetFee(e,n,a,i,r,s){const o=await e.tx.xyk.sellAsset(a,i,r,s).paymentInfo(n);return it(new t.BN(o.partialFee.toString()))}static async buyAssetFee(e,n,a,i,r,s){const o=await e.tx.xyk.buyAsset(a,i,r,s).paymentInfo(n);return it(new t.BN(o.partialFee.toString()))}static async mintLiquidityFee(e,n,a,i,r,s=new t.BN(Number.MAX_SAFE_INTEGER)){const o=await e.tx.xyk.mintLiquidity(a,i,r,s).paymentInfo(n);return it(new t.BN(o.partialFee.toString()))}static async burnLiquidityFee(e,n,a,i,r){const s=await e.tx.xyk.burnLiquidity(a,i,r).paymentInfo(n);return it(new t.BN(s.partialFee.toString()))}static async transferTokenFee(e,n,a,i,r){const s=await e.tx.tokens.transfer(i,a,r).paymentInfo(n);return it(new t.BN(s.partialFee.toString()))}static async transferAllTokenFee(e,n,a,i){const r=await e.tx.tokens.transferAll(i,a,!0).paymentInfo(n);return it(new t.BN(r.partialFee.toString()))}}class st{api;urls;static instanceMap=new Map;constructor(t){this.urls=t,this.api=(async()=>await this.connectToNode(t))()}async connectToNode(t){const e=new i.WsProvider(t,5e3);return await a.ApiPromise.create(r.options({provider:e,throwOnConnect:!0,throwOnUnknown:!0,noInitWarn:!0}))}static getInstance(t){return st.instanceMap.has(JSON.stringify(t))||st.instanceMap.set(JSON.stringify(t),new st(t)),st.instanceMap.get(JSON.stringify(t))}async getApi(){return this.api||(this.api=this.connectToNode(this.urls)),this.api}getUrls(){return this.urls}async waitForNewBlock(t){let e=0;const n=await this.getApi(),a=t||2;return new Promise((async t=>{const i=await n.rpc.chain.subscribeNewHeads((()=>{++e===a&&(i(),t(!0))}))}))}async getChain(){const t=await this.getApi();return l.getChain(t)}async getNodeName(){const t=await this.getApi();return l.getNodeName(t)}async getNodeVersion(){const t=await this.getApi();return l.getNodeVersion(t)}async getNonce(t){const e=await this.getApi();return _.getNonce(e,t)}async disconnect(){const t=await this.getApi();await t.disconnect()}async sendTokenFromMoonriverToMangata(t,a,i,r,s){const o=await n.Sdk().assets().asset("MOVR"===t?e.movr:e.mgx).source(e.moonriver).destination(e.mangataKusama).accounts(i,r,{ethersSigner:s}),c=it(a);await o.transfer(c)}async sendTokenFromMangataToMoonriver(t,e,n,a,i){const r=await this.getApi();return await K.sendTokenFromMangataToMoonriver(r,e,t,n,a,i)}async sendTokenFromStatemineToMangataFee(t,e,n,a,i,r){const s=await this.getApi();return await rt.sendTokenFromStatemineToMangataFee(s,t,e,n,a,i,r)}async sendTokenFromStatemineToMangata(t,e,n,a,i,r,s){const o=await this.getApi();return await K.sendTokenFromStatemineToMangata(o,t,e,n,a,i,r,s)}async sendTokenFromParachainToMangata(t,e,n,a,i,r,s){const o=await this.getApi();return await K.sendTokenFromParachainToMangata(o,t,e,n,a,i,r,s)}async sendTokenFromMangataToParachain(t,e,n,a,i,r,s){const o=await this.getApi();return await K.sendTokenFromMangataToParachain(o,t,e,n,a,i,r,s)}async sendTokenFromParachainToMangataFee(t,e,n,a,i,r){const s=await this.getApi();return await rt.sendTokenFromParachainToMangataFee(s,t,e,n,a,i,r)}async sendTokenFromMangataToParachainFee(t,e,n,a,i,r){const s=await this.getApi();return await rt.sendTokenFromMangataToParachainFee(s,t,e,n,a,i,r)}async sendKusamaTokenFromRelayToParachain(t,e,n,a,i=2110,r){return await K.sendKusamaTokenFromRelayToParachain(t,e,n,a,i,r)}async sendKusamaTokenFromRelayToParachainFee(t,e,n,a,i=2110){return await rt.sendKusamaTokenFromRelayToParachainFee(t,e,n,a,i)}async sendKusamaTokenFromParachainToRelay(t,e,n,a){const i=await this.getApi();return await K.sendKusamaTokenFromParachainToRelay(i,t,e,n,a)}async sendKusamaTokenFromParachainToRelayFee(t,e,n){const a=await this.getApi();return await rt.sendKusamaTokenFromParachainToRelayFee(a,t,e,n)}async sendTurTokenFromTuringToMangata(t,e,n,a,i){const r=await this.getApi();return await K.sendTurTokenFromTuringToMangata(r,t,e,n,a,i)}async sendTurTokenFromMangataToTuring(t,e,n,a){const i=await this.getApi();return await K.sendTurTokenFromMangataToTuring(i,t,e,n,a)}async sendTurTokenFromTuringToMangataFee(t,e,n,a){const i=await this.getApi();return await rt.sendTurTokenFromTuringToMangataFee(i,t,e,n,a)}async sendTurTokenFromMangataToTuringFee(t,e,n){const a=await this.getApi();return await rt.sendTurTokenFromMangataToTuringFee(a,t,e,n)}async activateLiquidity(t,e,n,a){const i=await this.getApi();return await K.activateLiquidity(i,t,e,n,a)}async deactivateLiquidity(t,e,n,a){const i=await this.getApi();return await K.deactivateLiquidity(i,t,e,n,a)}async calculateFutureRewardsAmountForMinting(e,n,a){const i=await this.getApi();return await(async(e,n,a,i)=>{const r=new t.BN("136986000000000000000000"),s=i.div(new t.BN("1200")).mul(r),o=(await e.query.proofOfStake.promotedPoolRewards()).toHuman(),c=Object.values(o).reduce(((e,n)=>e.add(new t.BN(n.weight))),new t.BN(0)),u=new t.BN(o[n].weight.toString()),d=s.mul(u).div(c),l=await e.query.proofOfStake.totalActivatedLiquidity(n);return d.mul(a).div(new t.BN(l.toString()).add(a))})(i,e,n,a)}async calculateRewardsAmount(t,e){const n=await this.getApi();return await l.calculateRewardsAmount(n,t,e)}async claimRewardsAllFee(t,e){const n=await this.getApi();return await rt.claimRewardsAllFee(n,t,e)}async claimRewardsAll(t,e,n){const a=await this.getApi();return await K.claimRewardsAll(a,t,e,n)}async createPoolFee(t,e,n,a,i){const r=await this.getApi();return await rt.createPoolFee(r,t,e,n,a,i)}async createPool(t,e,n,a,i,r){const s=await this.getApi();return await K.createPool(s,t,e,n,a,i,r)}async sellAssetFee(t,e,n,a,i){const r=await this.getApi();return await rt.sellAssetFee(r,t,e,n,a,i)}async sellAsset(t,e,n,a,i,r){const s=await this.getApi();return await K.sellAsset(s,t,e,n,a,i,r)}async mintLiquidityFee(t,e,n,a,i){const r=await this.getApi();return await rt.mintLiquidityFee(r,t,e,n,a,i)}async mintLiquidity(t,e,n,a,i,r){const s=await this.getApi();return await K.mintLiquidity(s,t,e,n,a,i,r)}async burnLiquidityFee(t,e,n,a){const i=await this.getApi();return await rt.burnLiquidityFee(i,t,e,n,a)}async burnLiquidity(t,e,n,a,i){const r=await this.getApi();return await K.burnLiquidity(r,t,e,n,a,i)}async buyAssetFee(t,e,n,a,i){const r=await this.getApi();return await rt.buyAssetFee(r,t,e,n,a,i)}async buyAsset(t,e,n,a,i,r){const s=await this.getApi();return await K.buyAsset(s,t,e,n,a,i,r)}async calculateBuyPrice(t,e,n){const a=await this.getApi();return await l.calculateBuyPrice(a,t,e,n)}async calculateSellPrice(t,e,n){const a=await this.getApi();return await l.calculateSellPrice(a,t,e,n)}async getBurnAmount(t,e,n){const a=await this.getApi();return await l.getBurnAmount(a,t,e,n)}async calculateSellPriceId(t,e,n){const a=await this.getApi();return await l.calculateSellPriceId(a,t,e,n)}async calculateBuyPriceId(t,e,n){const a=await this.getApi();return await l.calculateBuyPriceId(a,t,e,n)}async getAmountOfTokenIdInPool(t,e){const n=await this.getApi();return await _.getAmountOfTokenIdInPool(n,t,e)}async getLiquidityTokenId(t,e){const n=await this.getApi();return await _.getLiquidityTokenId(n,t,e)}async getLiquidityPool(t){const e=await this.getApi();return await _.getLiquidityPool(e,t)}async transferTokenFee(t,e,n,a){const i=await this.getApi();return await rt.transferTokenFee(i,t,e,n,a)}async transferToken(t,e,n,a,i){const r=await this.getApi();return await K.transferToken(r,t,e,n,a,i)}async transferTokenAllFee(t,e,n){const a=await this.getApi();return await rt.transferAllTokenFee(a,t,e,n)}async transferTokenAll(t,e,n,a){const i=await this.getApi();return await K.transferAllToken(i,t,e,n,a)}async getTotalIssuance(t){const e=await this.getApi();return await _.getTotalIssuance(e,t)}async getTokenBalance(t,e){const n=await this.getApi();return await _.getTokenBalance(n,e,t)}async getNextTokenId(){const t=await this.getApi();return await _.getNextTokenId(t)}async getTokenInfo(t){const e=await this.getApi();return await _.getTokenInfo(e,t)}async getBlockNumber(){const t=await this.getApi();return await _.getBlockNumber(t)}async getOwnedTokens(t){const e=await this.getApi();return await _.getOwnedTokens(e,t)}async getLiquidityTokenIds(){const t=await this.getApi();return await _.getLiquidityTokenIds(t)}async getAssetsInfo(){const t=await this.getApi();return await _.getAssetsInfo(t)}async getBalances(){const t=await this.getApi();return await _.getBalances(t)}async getLiquidityTokens(){const t=await this.getApi();return await _.getLiquidityTokens(t)}async getPool(t){const e=await this.getApi();return await _.getPool(e,t)}async getInvestedPools(t){const e=await this.getApi();return await _.getInvestedPools(e,t)}async getPools(){const t=await this.getApi();return await _.getPools(t)}}const ot=(t,e)=>{const n=new RegExp(`^-?\\d+(?:\\.\\d{0,${e}})?`,"gm"),a=t.match(n),i=(a?.[0]||t).match(/^-?0*(\d+(?:\.(?:(?!0+$)\d)+)?)/gm);return i?.[0]??t},ct=t=>{const e=+t;return!(!t||isNaN(Number(t))||isNaN(e)||e<0)};Object.defineProperty(exports,"BN",{enumerable:!0,get:function(){return t.BN}}),exports.BIG_BILLION=Q,exports.BIG_HUNDRED=X,exports.BIG_HUNDRED_BILLIONS=tt,exports.BIG_HUNDRED_MILLIONS=Z,exports.BIG_HUNDRED_THOUSAND=z,exports.BIG_MILLION=G,exports.BIG_ONE=U,exports.BIG_TEN=$,exports.BIG_TEN_BILLIONS=Y,exports.BIG_TEN_MILLIONS=j,exports.BIG_TEN_THOUSAND=W,exports.BIG_THOUSAND=C,exports.BIG_TRILLION=et,exports.BIG_ZERO=V,exports.BN_BILLION=P,exports.BN_DIV_NUMERATOR_MULTIPLIER=b,exports.BN_DIV_NUMERATOR_MULTIPLIER_DECIMALS=18,exports.BN_HUNDRED=A,exports.BN_HUNDRED_BILLIONS=v,exports.BN_HUNDRED_MILLIONS=F,exports.BN_HUNDRED_THOUSAND=S,exports.BN_MILLION=B,exports.BN_ONE=f,exports.BN_TEN=h,exports.BN_TEN_BILLIONS=O,exports.BN_TEN_MILLIONS=I,exports.BN_TEN_THOUSAND=x,exports.BN_THOUSAND=k,exports.BN_TRILLION=L,exports.BN_ZERO=N,exports.Mangata=st,exports.MangataHelpers=class{static createKeyring(t){return new a.Keyring({type:t})}static createKeyPairFromName(t,e=""){const n=e||"//testUser_"+c.v4(),a=t.createFromUri(n);return t.addPair(a),a}static getPriceImpact(t,e,n,a){if(!(t&&e&&ct(n)&&ct(a)))return;const i=t.firstTokenBalance,r=t.secondTokenBalance,s=at(n,e.firstTokenDecimals),o=at(a,e.secondTokenDecimals);if(o.gte(r))return"";const c=i.add(s).mul(x).mul(r),u=r.sub(o).mul(i),l=c.div(u).sub(x).toString(),y=d.default(l);return ot(y.div(X).toString(),2)}},exports.fromBN=it,exports.isBuyAssetTransactionSuccessful=t=>{const e=t.filter((t=>"ExtrinsicSuccess"===t.method)).length,n=t.filter((t=>"BuyAssetFailedDueToSlippage"===t.method)).length;return 1===e&&0===n},exports.isSellAssetTransactionSuccessful=t=>{const e=t.filter((t=>"ExtrinsicSuccess"===t.method)).length,n=t.filter((t=>"SellAssetFailedDueToSlippage"===t.method)).length;return 1===e&&0===n},exports.signTx=J,exports.toBN=at,exports.toFixed=ot;
