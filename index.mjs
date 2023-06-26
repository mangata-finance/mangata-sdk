import{isHex as t,hexToBn as e,BN as n,hexToString as a,BN_ZERO as i,hexToU8a as r}from"@polkadot/util";export{BN}from"@polkadot/util";import{movr as s,mgx as o,moonriver as c,mangataKusama as u}from"@moonbeam-network/xcm-config";import{Sdk as d}from"@moonbeam-network/xcm-sdk";import{ApiPromise as l,Keyring as y}from"@polkadot/api";import{WsProvider as g}from"@polkadot/rpc-provider/ws";import{options as w}from"@mangata-finance/types";import{encodeAddress as m}from"@polkadot/util-crypto";import p from"big.js";import{v4 as T}from"uuid";class f{static async getChain(t){return(await t.rpc.system.chain()).toHuman()}static async getNodeName(t){return(await t.rpc.system.name()).toHuman()}static async getNodeVersion(t){return(await t.rpc.system.version()).toHuman()}static async calculateRewardsAmount(a,i,r){const s=await a.rpc.xyk.calculate_rewards_amount(i,r);return t(s.price.toString())?e(s.price.toString()):new n(s.price)}static async calculateBuyPrice(t,e,a,i){const r=await t.rpc.xyk.calculate_buy_price(e,a,i);return new n(r.price)}static async calculateSellPrice(t,e,a,i){const r=await t.rpc.xyk.calculate_sell_price(e,a,i);return new n(r.price)}static async getBurnAmount(t,e,n,a){const i=await t.rpc.xyk.get_burn_amount(e,n,a);return JSON.parse(i.toString())}static async calculateSellPriceId(t,e,a,i){const r=await t.rpc.xyk.calculate_sell_price_id(e,a,i);return new n(r.price)}static async calculateBuyPriceId(t,e,a,i){const r=await t.rpc.xyk.calculate_buy_price_id(e,a,i);return new n(r.price)}}class h{static instance;db={};constructor(){}static getInstance(){return h.instance||(h.instance=new h),h.instance}hasAddressNonce=t=>!!this.db[t];setNonce=(t,e)=>{this.db[t]=e};getNonce=t=>this.db[t]}const k=h.getInstance(),A=async t=>(await t.query.assetRegistry.metadata.entries()).reduce(((t,[e,n])=>{const i=e.toHuman()[0].replace(/[, ]/g,""),r=n.toHuman(),{name:s,decimals:o,symbol:c}=r,u={id:i,chainId:0,decimals:Number(o.toString()),name:s,symbol:c,address:"MGA"===a(c.toString())?"0xc7e3bda797d2ceb740308ec40142ae235e08144a":"ETH"===a(c.toString())?"0x0000000000000000000000000000000000000000":""};return t[i]=u,t}),{}),S=async t=>(await t.query.xyk.liquidityAssets.entries()).reduce(((t,[e,n])=>{const a=e.args.map((t=>t.toHuman()))[0],i=n.toString().replace(/[, ]/g,"");return t[a]=i,t}),{}),x=async(a,i)=>(await a.query.tokens.accounts.entries(i)).reduce(((a,[i,r])=>{const s=JSON.parse(JSON.stringify(r)).free.toString(),o=JSON.parse(JSON.stringify(r)).frozen.toString(),c=JSON.parse(JSON.stringify(r)).reserved.toString(),u={free:t(s)?e(s):new n(s),frozen:t(o)?e(o):new n(o),reserved:t(c)?e(c):new n(c)};return a[i.toHuman()[1].replace(/[, ]/g,"")]=u,a}),{}),F=async t=>{const n=await A(t);return Object.values(n).filter((t=>"1"!==t.id&&"3"!==t.id)).reduce(((t,n)=>{const a={...n,name:n.name.replace(/0x\w+/,"").replace(/[A-Z]/g," $&").trim(),symbol:n.symbol.includes("TKN")?n.symbol.split("-").reduce(((t,n)=>{const a=n.replace("TKN",""),i=a.startsWith("0x")?e(a).toString():a;return t.push(i),t}),[]).join("-"):n.symbol};return t[a.id]=a,t}),{})},I=new n("0"),N=new n("1"),P=new n("10"),b=new n("100"),v=new n("1000"),q=new n("10000"),O=new n("100000"),M=new n("1000000"),R=new n("10000000"),L=new n("100000000"),H=new n("1000000000"),J=new n("10000000000"),B=new n("100000000000"),K=new n("1000000000000"),V=18,$=new n("10").pow(new n(18)),X=(t,e)=>e.gt(I)?X(e,t.mod(e)):t,_=(t,e)=>{const n=((t,e)=>{const n=X(t,e);return n.isZero()?[I,I]:[t.div(n),e.div(n)]})(t,e);return n[1].mul($).div(n[0])},C=async t=>{try{const e=(await t.query.proofOfStake.promotedPoolRewards()).toHuman();return Object.keys(e)}catch(t){return[]}};class E{static async getNonce(t,e){return(await t.rpc.system.accountNextIndex(e)).toBn()}static async getAmountOfTokenIdInPool(a,i,r){const s=JSON.parse(JSON.stringify(await a.query.xyk.pools([i,r])));return[t(s[0])?e(s[0]):new n(s[0]),t(s[1])?e(s[1]):new n(s[1])]}static async getLiquidityTokenId(t,e,a){const r=await t.query.xyk.liquidityAssets([e,a]);return r?new n(r.toString()):i}static async getLiquidityPool(t,e){const a=JSON.parse(JSON.stringify(await t.query.xyk.liquidityPools(e)));return a?a.map((t=>new n(t))):[new n(-1),new n(-1)]}static async getTotalIssuance(t,e){const a=await t.query.tokens.totalIssuance(e);return new n(a.toString())}static async getTokenBalance(a,i,r){const{free:s,reserved:o,frozen:c}=JSON.parse(JSON.stringify(await a.query.tokens.accounts(i,r)));return{free:t(s.toString())?e(s.toString()):new n(s.toString()),reserved:t(o.toString())?e(o.toString()):new n(o.toString()),frozen:t(c.toString())?e(c.toString()):new n(c.toString())}}static async getNextTokenId(t){const e=await t.query.tokens.nextCurrencyId();return new n(e.toString())}static async getTokenInfo(t,e){return(await this.getAssetsInfo(t))[e]}static async getLiquidityTokenIds(t){return(await t.query.xyk.liquidityAssets.entries()).map((t=>t[1].toString()))}static async getLiquidityTokens(t){const e=await this.getAssetsInfo(t);return Object.values(e).reduce(((t,e)=>(e.name.includes("Liquidity Pool Token")&&(t[e.id]=e),t)),{})}static async getAssetsInfo(t){const n=await A(t);return Object.values(n).filter((t=>!["1","3"].includes(t.id))).reduce(((t,a)=>{const i={...a,name:a.name.replace(/0x\w+/,"").replace(/[A-Z]/g,"$&").trim(),symbol:a.symbol.includes("TKN")?a.symbol.split("-").reduce(((t,a)=>{const i=a.replace("TKN",""),r=i.startsWith("0x")?e(i).toString():i,s=n[r].symbol;return t.push(s),t}),[]).join("-"):a.symbol};return t[i.id]=i,t}),{})}static async getBlockNumber(t){return(await t.rpc.chain.getBlock()).block.header.number.toString()}static async getOwnedTokens(t,e){if(!e)return null;const[n,a]=await Promise.all([this.getAssetsInfo(t),x(t,e)]);return Object.values(n).reduce(((t,e)=>(Object.keys(a).includes(e.id)&&(t[e.id]={...e,balance:a[e.id]}),t)),{})}static async getBalances(t){return(await t.query.tokens.totalIssuance.entries()).reduce(((t,[e,a])=>{const i=e.toHuman()[0].replace(/[, ]/g,""),r=new n(a.toString());return t[i]=r,t}),{})}static async getInvestedPools(t,e){const[a,r,s]=await Promise.all([F(t),x(t,e),C(t)]),o=Object.values(a).reduce(((t,e)=>(Object.keys(r).includes(e.id)&&e.name.includes("Liquidity Pool Token")&&t.push(e),t)),[]).map((async e=>{const a=r[e.id],o=e.symbol.split("-")[0],c=e.symbol.split("-")[1],[u,d]=await this.getAmountOfTokenIdInPool(t,o.toString(),c.toString()),l=await(async(t,e,a)=>{if(a.isZero())return I;const i=await t.query.tokens.totalIssuance(e),r=new n(i.toString());return a.mul($).div(r)})(t,e.id,a.free.add(a.reserved));return{firstTokenId:o,secondTokenId:c,firstTokenAmount:u,secondTokenAmount:d,liquidityTokenId:e.id,isPromoted:s.includes(e.id),share:l,firstTokenRatio:l.eq(i)?i:_(u,d),secondTokenRatio:l.eq(i)?i:_(d,u),activatedLPTokens:a.reserved,nonActivatedLPTokens:a.free}}));return Promise.all(o)}static async getPool(t,e){const n=await this.getLiquidityPool(t,e),a=(await t.query.proofOfStake.promotedPoolRewards()).toHuman()[e],[i,r]=n,[s,o]=await this.getAmountOfTokenIdInPool(t,i.toString(),r.toString());return{firstTokenId:i.toString(),secondTokenId:r.toString(),firstTokenAmount:s,secondTokenAmount:o,liquidityTokenId:e,isPromoted:!!a,firstTokenRatio:_(s,o),secondTokenRatio:_(o,s)}}static async getPools(a){const[i,r]=await Promise.all([F(a),S(a)]),s=await(async(a,i)=>(await a.query.xyk.pools.entries()).reduce(((a,[r,s])=>{const o=r.args.map((t=>t.toHuman()))[0],c=JSON.parse(JSON.stringify(s)).map((a=>t(a)?e(a):new n(a)));return a[i[o]]=c,a}),{}))(a,r),o=await C(a);return Object.values(i).reduce(((t,e)=>Object.values(r).includes(e.id)?t.concat(e):t),[]).map((t=>{const[e,n]=s[t.id];return{firstTokenId:t.symbol.split("-")[0],secondTokenId:t.symbol.split("-")[1],firstTokenAmount:e,secondTokenAmount:n,liquidityTokenId:t.id,firstTokenRatio:_(e,n),secondTokenRatio:_(n,e),isPromoted:o.includes(t.id)}}))}}const z=(t,e)=>e?.meta.args.at(-1)?.type.eq("XcmV2WeightLimit")?{Limited:t}:t,j=(t,e)=>"BNC"===t?{parents:"0",interior:{x1:{generalKey:{length:2,data:"0x0001000000000000000000000000000000000000000000000000000000000000"}}}}:"vBNC"===t?{parents:"0",interior:{x1:{generalKey:{length:2,data:"0x0101000000000000000000000000000000000000000000000000000000000000"}}}}:"ZLK"===t?{parents:"0",interior:{x1:{generalKey:{length:2,data:"0x0207000000000000000000000000000000000000000000000000000000000000"}}}}:"vsKSM"===t?{parents:"0",interior:{x1:{generalKey:{length:2,data:"0x0404000000000000000000000000000000000000000000000000000000000000"}}}}:"vKSM"===t?{parents:"0",interior:{x1:{generalKey:{length:2,data:"0x0104000000000000000000000000000000000000000000000000000000000000"}}}}:"USDT"===t?{parents:"0",interior:{x2:[{PalletInstance:50},{GeneralIndex:1984}]}}:"RMRK"===t?{parents:"0",interior:{x2:[{PalletInstance:50},{GeneralIndex:8}]}}:{interior:e.v3.interior};const U=async(t,e,n,a)=>new Promise((async(i,r)=>{const s="string"==typeof n?n:n.address;let o=!1;const c=await(async(t,e,n)=>{let a;if(n&&n.nonce)a=n.nonce;else{const n=await E.getNonce(t,e);a=k.hasAddressNonce(e)?k.getNonce(e):n,n&&n.gt(a)&&(a=n);const i=a.addn(1);k.setNonce(e,i)}return a})(t,s,a);try{await e.signAsync(n,{nonce:c,signer:a?.signer})}catch(t){r(t)}console.info(`submitting Tx[${e.hash.toString()}]who: ${s} nonce: ${c.toString()} `);try{const n=await e.send((async u=>{if(console.info(`Tx[${e.hash.toString()}]who: ${s} nonce: ${c.toString()} => ${u.status.type}(${u.status.value.toString()})${function(t,e){if(!process.env.TX_VERBOSE)return"";const n=JSON.parse(e.method.toString()),a=JSON.stringify(n.args),i=t.registry.findMetaCall(e.method.callIndex);if("sudo"==i.method&&"sudo"==i.method){const a=e.method.args[0].callIndex,i=JSON.stringify(n.args.call.args),r=t.registry.findMetaCall(a);return` (sudo:: ${r.section}:: ${r.method}(${i})`}return` (${i.section}:: ${i.method}(${a}))`}(t,e)}`),a?.statusCallback?.(u),!u.status.isInBlock&&!u.status.isFinalized||o){if(u.isError){console.info("Transaction Error Result",JSON.stringify(u,null,2)),r(`Tx([${e.hash.toString()}]) Transaction error`);const n=await E.getNonce(t,s);k.setNonce(s,n)}}else{let d;o=!0,u.status.isInBlock?d=u.status.asInBlock.toString():u.status.isFinalized&&(d=u.status.asFinalized.toString());const l=(await t.rpc.chain.getHeader(d)).number.toBn(),y=l.addn(0),g=l.addn(10),w=y,m=await t.rpc.chain.subscribeNewHeads((async o=>{const u=o.number.toBn();if(w.gt(g)){m(),r(`Tx([${e.hash.toString()}])\n                      was not executed in blocks : ${y.toString()}..${g.toString()}`);const a=await E.getNonce(t,s);return k.setNonce(s,a),void n()}if(u.gte(w)){const r=await t.rpc.chain.getBlockHash(w),o=await t.rpc.chain.getHeader(r),u=(await t.rpc.chain.getBlock(o.hash)).block.extrinsics,d=await t.at(o.hash),l=await d.query.system.events();w.iaddn(1);const y=u.findIndex((t=>t.hash.toString()===e.hash.toString()));if(y<0)return void console.info(`Tx([${e.hash.toString()}]) not found in block ${w} $([${(t=>{if(!t)return"";const e=t.length;return t.substring(0,7)+"..."+t.substring(e-5,e)})(r.toString())}])`);m(),console.info(`Tx[${e.hash.toString()}]who:${s} nonce:${c.toString()} => Executed(${r.toString()})`);const g=l.filter((t=>t.phase.isApplyExtrinsic&&t.phase.asApplyExtrinsic.toNumber()===y)).map((e=>{const{event:n,phase:a}=e,i=n.typeDef,r=n.data.map(((t,e)=>({lookupName:i[e].lookupName,data:t})));return{event:n,phase:a,section:n.section,method:n.method,metaDocumentation:n.meta.docs.toString(),eventData:r,error:D(t,n.method,r)}}));a?.extrinsicStatus?.(g),i(g),n()}}))}}))}catch(e){const n=await E.getNonce(t,s);k.setNonce(s,n),r({data:e.message||e.description||e.data?.toString()||e.toString()})}})),D=(e,a,i)=>{if("ExtrinsicFailed"===a){const a=i.find((t=>t.lookupName.includes("DispatchError"))),s=a?.data?.toHuman?.(),o=s?.Module?.error,c=s?.Module?.index;if(!o||!c)return{documentation:["Unknown error"],name:"UnknownError"};try{const a=e.registry.findMetaError({error:t(o)?r(o):new n(o),index:new n(c)});return{documentation:a.docs,name:a.name}}catch(t){return{documentation:["Unknown error"],name:"UnknownError"}}}return null};class W{static async sendKusamaTokenFromRelayToParachain(t,e,a,i,r,s){const o=new g(t),c=await new l({provider:o,noInitWarn:!0}).isReady;await c.tx.xcmPallet.limitedReserveTransferAssets({V3:{parents:0,interior:{X1:{Parachain:r}}}},{V3:{parents:0,interior:{X1:{AccountId32:{id:c.createType("AccountId32",a).toHex()}}}}},{V3:[{id:{Concrete:{parents:0,interior:"Here"}},fun:{Fungible:i}}]},0,{Limited:{refTime:new n("298368000"),proofSize:0}}).signAndSend(e,{signer:s?.signer,nonce:s?.nonce})}static async sendKusamaTokenFromParachainToRelay(t,e,a,i,r){const s={V3:{parents:1,interior:{X1:{AccountId32:{id:t.createType("AccountId32",a).toHex()}}}}},o={Limited:{refTime:new n("6000000000"),proofSize:0}};await t.tx.xTokens.transfer("4",i,s,o).signAndSend(e,{signer:r?.signer,nonce:r?.nonce})}static async sendTokenFromStatemineToMangata(...t){const[e,a,i,r,s,o,c,u]=t,d=new g(a),y=await new l({provider:d,noInitWarn:!0}).isReady,w=m(o,42),p=(await e.query.assetRegistry.metadata.entries()).filter((t=>JSON.stringify(t[1].toHuman()).includes(i)))[0],T=JSON.parse(JSON.stringify(p[1].toJSON()));T&&T.location&&await y.tx.polkadotXcm.limitedReserveTransferAssets({V3:{interior:{X1:{Parachain:2110}},parents:1}},{V3:{interior:{X1:{AccountId32:{id:y.createType("AccountId32",w).toHex()}}},parents:0}},{V3:[{fun:{Fungible:c},id:{Concrete:j(i,T.location)}}]},0,{Limited:{refTime:new n(r),proofSize:0}}).signAndSend(s,{signer:u?.signer,nonce:u?.nonce})}static async sendTokenFromParachainToMangata(...t){const[e,a,i,r,s,o,c,u]=t,d=new g(a),y=await new l({provider:d,noInitWarn:!0}).isReady,w=m(o,42),p=(await e.query.assetRegistry.metadata.entries()).filter((t=>JSON.stringify(t[1].toHuman()).includes(i)))[0],T=JSON.parse(JSON.stringify(p[1].toJSON()));if(T&&T.location){let t=null;t=["BNC","vBNC","ZLK","vsKSM","vKSM"].includes(i)?j(i,T.location):{parents:1,interior:T.location.v3.interior};const e={V3:{id:{Concrete:t},fun:{Fungible:c}}},a={V3:{parents:1,interior:{X2:[{Parachain:2110},{AccountId32:{id:y.createType("AccountId32",w).toHex()}}]}}},o={Limited:{refTime:new n(r),proofSize:0}};await y.tx.xTokens.transferMultiasset(e,a,o).signAndSend(s,{signer:u?.signer,nonce:u?.nonce})}}static async sendTokenFromMangataToParachain(...t){const[e,a,i,r,s,o,c,u]=t,d=m(o,42),l=(await e.query.assetRegistry.metadata.entries()).filter((t=>JSON.stringify(t[1].toHuman()).includes(a)))[0],y=JSON.parse(JSON.stringify(l[1].toJSON()));if(y&&y.location){const t=l[0].toHuman()[0].replace(/[, ]/g,""),o={V3:{parents:1,interior:{X2:[{Parachain:r},{AccountId32:{id:e.createType("AccountId32",d).toHex()}}]}}};let y;y=["RMRK","USDT"].includes(a)?"Unlimited":{Limited:{ref_time:new n(i),proof_size:0}},await U(e,e.tx.xTokens.transfer(t,c,o,y),s,u)}}static async sendTurTokenFromTuringToMangata(t,e,a,i,r,s){const o=new g(e),c=await new l({provider:o}).isReady,u=m(i,42),d={V1:{id:{Concrete:{parents:1,interior:{X1:{Parachain:2114}}}},fun:{Fungible:r}}},y={V1:{parents:1,interior:{X2:[{Parachain:2110},{AccountId32:{network:"Any",id:t.createType("AccountId32",u).toHex()}}]}}},w=z(new n("4000000000"),t.tx.xTokens.transferMultiasset);await c.tx.xTokens.transferMultiasset(d,y,w).signAndSend(a,{signer:s?.signer,nonce:s?.nonce})}static async sendTurTokenFromMangataToTuring(t,e,a,i,r){const s=m(a,42),o={V1:{parents:1,interior:{X2:[{Parachain:2114},{AccountId32:{network:"Any",id:t.createType("AccountId32",s).toHex()}}]}}};await U(t,t.tx.xTokens.transfer("7",i,o,new n("6000000000")),e,r)}static async sendTokenFromMangataToMoonriver(t,e,a,i,r,s){const o=(await t.query.assetRegistry.metadata.entries()).filter((t=>JSON.stringify(t[1].toHuman()).includes(a)))[0][0].toHuman()[0].replace(/[, ]/g,""),c={V3:{parents:1,interior:{X2:[{Parachain:2023},{AccountKey20:{key:t.createType("AccountId20",i).toHex()}}]}}},u={Limited:{ref_time:new n("1000000000"),proof_size:0}};await U(t,t.tx.xTokens.transfer(o,r,c,u),e,s)}static async activateLiquidity(t,e,n,a,i){return await U(t,t.tx.proofOfStake.activateLiquidity(n,a,null),e,i)}static async deactivateLiquidity(t,e,n,a,i){return await U(t,t.tx.proofOfStake.deactivateLiquidity(n,a),e,i)}static async claimRewardsAll(t,e,n,a){return await U(t,t.tx.proofOfStake.claimRewardsAll(n),e,a)}static async createPool(t,e,n,a,i,r,s){return await U(t,t.tx.xyk.createPool(n,a,i,r),e,s)}static async sellAsset(t,e,n,a,i,r,s){return await U(t,t.tx.xyk.sellAsset(n,a,i,r),e,s)}static async buyAsset(t,e,n,a,i,r,s){return await U(t,t.tx.xyk.buyAsset(n,a,i,r),e,s)}static async mintLiquidity(t,e,n,a,i,r,s){return await U(t,t.tx.xyk.mintLiquidity(n,a,i,r),e,s)}static async burnLiquidity(t,e,n,a,i,r){return await U(t,t.tx.xyk.burnLiquidity(n,a,i),e,r)}static async transferToken(t,e,n,a,i,r){return await U(t,t.tx.tokens.transfer(a,n,i),e,r)}static async transferAllToken(t,e,n,a,i){return await U(t,t.tx.tokens.transferAll(a,n,!0),e,i)}}const Z=p("0"),G=p("1"),Q=p("10"),Y=p("100"),tt=p("1000"),et=p("10000"),nt=p("100000"),at=p("1000000"),it=p("10000000"),rt=p("100000000"),st=p("1000000000"),ot=p("10000000000"),ct=p("100000000000"),ut=p("1000000000000");p.PE=256,p.NE=-256,p.DP=40,p.RM=p.roundUp;const dt=Q.pow(18),lt=(t,e)=>{if(!t)return I;try{const a=p(t),i=e&&18!==e?Q.pow(e):dt,r=a.mul(i).toString();return/\D/gm.test(r)?I:new n(r)}catch(t){return I}},yt=(t,e)=>{if(!t)return"0";try{const n=p(t.toString()),a=e&&18!==e?Q.pow(e):dt,i=n.div(a);return i.toString()}catch(t){return"0"}};class gt{static async sendTokenFromParachainToMangataFee(...t){const[e,a,i,r,s,o,c]=t,u=new g(a),d=await new l({provider:u,noInitWarn:!0}).isReady,y=m(o,42),w=(await e.query.assetRegistry.metadata.entries()).filter((t=>JSON.stringify(t[1].toHuman()).includes(i)))[0];if(!Array.isArray(w)||!w.length)return"0";const p=JSON.parse(JSON.stringify(w[1].toJSON()));if(!p.location)return"0";const{decimals:T}=p;let f=null;f=["BNC","vBNC","ZLK","vsKSM","vKSM"].includes(i)?j(i,p.location):{parents:1,interior:p.location.v3.interior};const h={V3:{id:{Concrete:f},fun:{Fungible:c}}},k={V3:{parents:1,interior:{X2:[{Parachain:2110},{AccountId32:{id:d.createType("AccountId32",y).toHex()}}]}}},A={Limited:{refTime:new n(r),proofSize:0}},S=await d.tx.xTokens.transferMultiasset(h,k,A).paymentInfo(s);return yt(new n(S.partialFee.toString()),Number(T))}static async sendTokenFromMangataToParachainFee(...t){const[e,a,i,r,s,o,c]=t,u=m(o,42),d=(await e.query.assetRegistry.metadata.entries()).filter((t=>JSON.stringify(t[1].toHuman()).includes(a)))[0];if(!Array.isArray(d)||!d.length)return"0";const l=d[0].toHuman()[0].replace(/[, ]/g,""),y={V3:{parents:1,interior:{X2:[{Parachain:r},{AccountId32:{id:e.createType("AccountId32",u).toHex()}}]}}};let g;g=["RMRK","USDT"].includes(a)?"Unlimited":{Limited:{ref_time:new n(i),proof_size:0}};const w=await e.tx.xTokens.transfer(l,c,y,g).paymentInfo(s);return yt(new n(w.partialFee.toString()))}static async sendTurTokenFromTuringToMangataFee(t,e,a,i,r){const s=new g(e),o=await new l({provider:s}).isReady,c=m(i,42),u={V1:{id:{Concrete:{parents:1,interior:{X1:{Parachain:2114}}}},fun:{Fungible:r}}},d={V1:{parents:1,interior:{X2:[{Parachain:2110},{AccountId32:{network:"Any",id:t.createType("AccountId32",c).toHex()}}]}}},y=z(new n("4000000000"),t.tx.xTokens.transferMultiasset),w=await o.tx.xTokens.transferMultiasset(u,d,y).paymentInfo(a);return yt(new n(w.partialFee.toString()),10)}static async sendTurTokenFromMangataToTuringFee(t,e,a,i){const r=m(a,42),s={V1:{parents:1,interior:{X2:[{Parachain:2114},{AccountId32:{network:"Any",id:t.createType("AccountId32",r).toHex()}}]}}},o=await t.tx.xTokens.transfer("7",i,s,new n("6000000000")).paymentInfo(e);return yt(new n(o.partialFee.toString()))}static async sendTokenFromStatemineToMangataFee(...t){const[e,a,i,r,s,o,c]=t,u=new g(a),d=await new l({provider:u,noInitWarn:!0}).isReady,y=m(o,42),w=(await e.query.assetRegistry.metadata.entries()).filter((t=>JSON.stringify(t[1].toHuman()).includes(i)))[0];if(!Array.isArray(w)||!w.length)return"0";const p=JSON.parse(JSON.stringify(w[1].toJSON()));if(!p.location)return"0";const{location:T}=p,f=await d.tx.polkadotXcm.limitedReserveTransferAssets({V3:{interior:{X1:{Parachain:2110}},parents:1}},{V3:{interior:{X1:{AccountId32:{id:d.createType("AccountId32",y).toHex()}}},parents:0}},{V3:[{fun:{Fungible:c},id:{Concrete:j(i,T)}}]},0,{Limited:{refTime:new n(r),proofSize:0}}).paymentInfo(s);return yt(new n(f.partialFee.toString()),12)}static async sendKusamaTokenFromRelayToParachainFee(t,e,a,i,r){const s=new g(t),o=await new l({provider:s,noInitWarn:!0}).isReady,c=o.tx.xcmPallet.limitedReserveTransferAssets({V3:{parents:0,interior:{X1:{Parachain:r}}}},{V3:{parents:0,interior:{X1:{AccountId32:{id:o.createType("AccountId32",a).toHex()}}}}},{V3:[{id:{Concrete:{parents:0,interior:"Here"}},fun:{Fungible:i}}]},0,{Limited:{refTime:new n("298368000"),proofSize:0}}),u=await c.paymentInfo(e);return yt(new n(u.partialFee.toString()),12)}static async sendKusamaTokenFromParachainToRelayFee(t,e,a,i){const r={V3:{parents:1,interior:{X1:{AccountId32:{id:t.createType("AccountId32",a).toHex()}}}}},s={Limited:{refTime:new n("6000000000"),proofSize:0}},o=await t.tx.xTokens.transfer("4",i,r,s).paymentInfo(e);return yt(new n(o.partialFee.toString()))}static async activateLiquidity(t,e,a,i){const r=await t.tx.proofOfStake.activateLiquidity(a,i,null).paymentInfo(e);return yt(new n(r.partialFee.toString()))}static async deactivateLiquidity(t,e,a,i){const r=await t.tx.proofOfStake.deactivateLiquidity(a,i).paymentInfo(e);return yt(new n(r.partialFee.toString()))}static async claimRewardsAllFee(t,e,a){const i=await t.tx.proofOfStake.claimRewardsAll(a).paymentInfo(e);return yt(new n(i.partialFee.toString()))}static async createPoolFee(t,e,a,i,r,s){const o=await t.tx.xyk.createPool(a,i,r,s).paymentInfo(e);return yt(new n(o.partialFee.toString()))}static async sellAssetFee(t,e,a,i,r,s){const o=await t.tx.xyk.sellAsset(a,i,r,s).paymentInfo(e);return yt(new n(o.partialFee.toString()))}static async buyAssetFee(t,e,a,i,r,s){const o=await t.tx.xyk.buyAsset(a,i,r,s).paymentInfo(e);return yt(new n(o.partialFee.toString()))}static async mintLiquidityFee(t,e,a,i,r,s=new n(Number.MAX_SAFE_INTEGER)){const o=await t.tx.xyk.mintLiquidity(a,i,r,s).paymentInfo(e);return yt(new n(o.partialFee.toString()))}static async burnLiquidityFee(t,e,a,i,r){const s=await t.tx.xyk.burnLiquidity(a,i,r).paymentInfo(e);return yt(new n(s.partialFee.toString()))}static async transferTokenFee(t,e,a,i,r){const s=await t.tx.tokens.transfer(i,a,r).paymentInfo(e);return yt(new n(s.partialFee.toString()))}static async transferAllTokenFee(t,e,a,i){const r=await t.tx.tokens.transferAll(i,a,!0).paymentInfo(e);return yt(new n(r.partialFee.toString()))}}class wt{api;urls;static instanceMap=new Map;constructor(t){this.urls=t,this.api=(async()=>await this.connectToNode(t))()}async connectToNode(t){const e=new g(t,5e3);return await l.create(w({provider:e,throwOnConnect:!0,throwOnUnknown:!0,noInitWarn:!0}))}static getInstance(t){return wt.instanceMap.has(JSON.stringify(t))||wt.instanceMap.set(JSON.stringify(t),new wt(t)),wt.instanceMap.get(JSON.stringify(t))}async getApi(){return this.api||(this.api=this.connectToNode(this.urls)),this.api}getUrls(){return this.urls}async waitForNewBlock(t){let e=0;const n=await this.getApi(),a=t||2;return new Promise((async t=>{const i=await n.rpc.chain.subscribeNewHeads((()=>{++e===a&&(i(),t(!0))}))}))}async getChain(){const t=await this.getApi();return f.getChain(t)}async getNodeName(){const t=await this.getApi();return f.getNodeName(t)}async getNodeVersion(){const t=await this.getApi();return f.getNodeVersion(t)}async getNonce(t){const e=await this.getApi();return E.getNonce(e,t)}async disconnect(){const t=await this.getApi();await t.disconnect()}async sendTokenFromMoonriverToMangata(t,e,n,a,i){const r=await d().assets().asset("MOVR"===t?s:o).source(c).destination(u).accounts(n,a,{ethersSigner:i}),l=yt(e);await r.transfer(l)}async sendTokenFromMangataToMoonriver(t,e,n,a,i){const r=await this.getApi();return await W.sendTokenFromMangataToMoonriver(r,e,t,n,a,i)}async sendTokenFromStatemineToMangataFee(t,e,n,a,i,r){const s=await this.getApi();return await gt.sendTokenFromStatemineToMangataFee(s,t,e,n,a,i,r)}async sendTokenFromStatemineToMangata(t,e,n,a,i,r,s){const o=await this.getApi();return await W.sendTokenFromStatemineToMangata(o,t,e,n,a,i,r,s)}async sendTokenFromParachainToMangata(t,e,n,a,i,r,s){const o=await this.getApi();return await W.sendTokenFromParachainToMangata(o,t,e,n,a,i,r,s)}async sendTokenFromMangataToParachain(t,e,n,a,i,r,s){const o=await this.getApi();return await W.sendTokenFromMangataToParachain(o,t,e,n,a,i,r,s)}async sendTokenFromParachainToMangataFee(t,e,n,a,i,r){const s=await this.getApi();return await gt.sendTokenFromParachainToMangataFee(s,t,e,n,a,i,r)}async sendTokenFromMangataToParachainFee(t,e,n,a,i,r){const s=await this.getApi();return await gt.sendTokenFromMangataToParachainFee(s,t,e,n,a,i,r)}async sendKusamaTokenFromRelayToParachain(t,e,n,a,i=2110,r){return await W.sendKusamaTokenFromRelayToParachain(t,e,n,a,i,r)}async sendKusamaTokenFromRelayToParachainFee(t,e,n,a,i=2110){return await gt.sendKusamaTokenFromRelayToParachainFee(t,e,n,a,i)}async sendKusamaTokenFromParachainToRelay(t,e,n,a){const i=await this.getApi();return await W.sendKusamaTokenFromParachainToRelay(i,t,e,n,a)}async sendKusamaTokenFromParachainToRelayFee(t,e,n){const a=await this.getApi();return await gt.sendKusamaTokenFromParachainToRelayFee(a,t,e,n)}async sendTurTokenFromTuringToMangata(t,e,n,a,i){const r=await this.getApi();return await W.sendTurTokenFromTuringToMangata(r,t,e,n,a,i)}async sendTurTokenFromMangataToTuring(t,e,n,a){const i=await this.getApi();return await W.sendTurTokenFromMangataToTuring(i,t,e,n,a)}async sendTurTokenFromTuringToMangataFee(t,e,n,a){const i=await this.getApi();return await gt.sendTurTokenFromTuringToMangataFee(i,t,e,n,a)}async sendTurTokenFromMangataToTuringFee(t,e,n){const a=await this.getApi();return await gt.sendTurTokenFromMangataToTuringFee(a,t,e,n)}async activateLiquidity(t,e,n,a){const i=await this.getApi();return await W.activateLiquidity(i,t,e,n,a)}async deactivateLiquidity(t,e,n,a){const i=await this.getApi();return await W.deactivateLiquidity(i,t,e,n,a)}async calculateFutureRewardsAmountForMinting(t,e,a){const i=await this.getApi();return await(async(t,e,a,i)=>{const r=new n("136986000000000000000000"),s=i.div(new n("1200")).mul(r),o=(await t.query.proofOfStake.promotedPoolRewards()).toHuman(),c=Object.values(o).reduce(((t,e)=>t.add(new n(e.weight))),new n(0)),u=new n(o[e].weight.toString()),d=s.mul(u).div(c),l=await t.query.proofOfStake.totalActivatedLiquidity(e);return d.mul(a).div(new n(l.toString()).add(a))})(i,t,e,a)}async calculateRewardsAmount(t,e){const n=await this.getApi();return await f.calculateRewardsAmount(n,t,e)}async claimRewardsAllFee(t,e){const n=await this.getApi();return await gt.claimRewardsAllFee(n,t,e)}async claimRewardsAll(t,e,n){const a=await this.getApi();return await W.claimRewardsAll(a,t,e,n)}async createPoolFee(t,e,n,a,i){const r=await this.getApi();return await gt.createPoolFee(r,t,e,n,a,i)}async createPool(t,e,n,a,i,r){const s=await this.getApi();return await W.createPool(s,t,e,n,a,i,r)}async sellAssetFee(t,e,n,a,i){const r=await this.getApi();return await gt.sellAssetFee(r,t,e,n,a,i)}async sellAsset(t,e,n,a,i,r){const s=await this.getApi();return await W.sellAsset(s,t,e,n,a,i,r)}async mintLiquidityFee(t,e,n,a,i){const r=await this.getApi();return await gt.mintLiquidityFee(r,t,e,n,a,i)}async mintLiquidity(t,e,n,a,i,r){const s=await this.getApi();return await W.mintLiquidity(s,t,e,n,a,i,r)}async burnLiquidityFee(t,e,n,a){const i=await this.getApi();return await gt.burnLiquidityFee(i,t,e,n,a)}async burnLiquidity(t,e,n,a,i){const r=await this.getApi();return await W.burnLiquidity(r,t,e,n,a,i)}async buyAssetFee(t,e,n,a,i){const r=await this.getApi();return await gt.buyAssetFee(r,t,e,n,a,i)}async buyAsset(t,e,n,a,i,r){const s=await this.getApi();return await W.buyAsset(s,t,e,n,a,i,r)}async calculateBuyPrice(t,e,n){const a=await this.getApi();return await f.calculateBuyPrice(a,t,e,n)}async calculateSellPrice(t,e,n){const a=await this.getApi();return await f.calculateSellPrice(a,t,e,n)}async getBurnAmount(t,e,n){const a=await this.getApi();return await f.getBurnAmount(a,t,e,n)}async calculateSellPriceId(t,e,n){const a=await this.getApi();return await f.calculateSellPriceId(a,t,e,n)}async calculateBuyPriceId(t,e,n){const a=await this.getApi();return await f.calculateBuyPriceId(a,t,e,n)}async getAmountOfTokenIdInPool(t,e){const n=await this.getApi();return await E.getAmountOfTokenIdInPool(n,t,e)}async getLiquidityTokenId(t,e){const n=await this.getApi();return await E.getLiquidityTokenId(n,t,e)}async getLiquidityPool(t){const e=await this.getApi();return await E.getLiquidityPool(e,t)}async transferTokenFee(t,e,n,a){const i=await this.getApi();return await gt.transferTokenFee(i,t,e,n,a)}async transferToken(t,e,n,a,i){const r=await this.getApi();return await W.transferToken(r,t,e,n,a,i)}async transferTokenAllFee(t,e,n){const a=await this.getApi();return await gt.transferAllTokenFee(a,t,e,n)}async transferTokenAll(t,e,n,a){const i=await this.getApi();return await W.transferAllToken(i,t,e,n,a)}async getTotalIssuance(t){const e=await this.getApi();return await E.getTotalIssuance(e,t)}async getTokenBalance(t,e){const n=await this.getApi();return await E.getTokenBalance(n,e,t)}async getNextTokenId(){const t=await this.getApi();return await E.getNextTokenId(t)}async getTokenInfo(t){const e=await this.getApi();return await E.getTokenInfo(e,t)}async getBlockNumber(){const t=await this.getApi();return await E.getBlockNumber(t)}async getOwnedTokens(t){const e=await this.getApi();return await E.getOwnedTokens(e,t)}async getLiquidityTokenIds(){const t=await this.getApi();return await E.getLiquidityTokenIds(t)}async getAssetsInfo(){const t=await this.getApi();return await E.getAssetsInfo(t)}async getBalances(){const t=await this.getApi();return await E.getBalances(t)}async getLiquidityTokens(){const t=await this.getApi();return await E.getLiquidityTokens(t)}async getPool(t){const e=await this.getApi();return await E.getPool(e,t)}async getInvestedPools(t){const e=await this.getApi();return await E.getInvestedPools(e,t)}async getPools(){const t=await this.getApi();return await E.getPools(t)}}const mt=(t,e)=>{const n=new RegExp(`^-?\\d+(?:\\.\\d{0,${e}})?`,"gm"),a=t.match(n),i=(a?.[0]||t).match(/^-?0*(\d+(?:\.(?:(?!0+$)\d)+)?)/gm);return i?.[0]??t},pt=t=>{const e=+t;return!(!t||isNaN(Number(t))||isNaN(e)||e<0)};class Tt{static createKeyring(t){return new y({type:t})}static createKeyPairFromName(t,e=""){const n=e||"//testUser_"+T(),a=t.createFromUri(n);return t.addPair(a),a}static getPriceImpact(t,e,n,a){if(!(t&&e&&pt(n)&&pt(a)))return;const i=t.firstTokenBalance,r=t.secondTokenBalance,s=lt(n,e.firstTokenDecimals),o=lt(a,e.secondTokenDecimals);if(o.gte(r))return"";const c=i.add(s).mul(q).mul(r),u=r.sub(o).mul(i),d=c.div(u).sub(q).toString(),l=p(d);return mt(l.div(Y).toString(),2)}}const ft=t=>{const e=t.filter((t=>"ExtrinsicSuccess"===t.method)).length,n=t.filter((t=>"SellAssetFailedDueToSlippage"===t.method)).length;return 1===e&&0===n},ht=t=>{const e=t.filter((t=>"ExtrinsicSuccess"===t.method)).length,n=t.filter((t=>"BuyAssetFailedDueToSlippage"===t.method)).length;return 1===e&&0===n};export{st as BIG_BILLION,Y as BIG_HUNDRED,ct as BIG_HUNDRED_BILLIONS,rt as BIG_HUNDRED_MILLIONS,nt as BIG_HUNDRED_THOUSAND,at as BIG_MILLION,G as BIG_ONE,Q as BIG_TEN,ot as BIG_TEN_BILLIONS,it as BIG_TEN_MILLIONS,et as BIG_TEN_THOUSAND,tt as BIG_THOUSAND,ut as BIG_TRILLION,Z as BIG_ZERO,H as BN_BILLION,$ as BN_DIV_NUMERATOR_MULTIPLIER,V as BN_DIV_NUMERATOR_MULTIPLIER_DECIMALS,b as BN_HUNDRED,B as BN_HUNDRED_BILLIONS,L as BN_HUNDRED_MILLIONS,O as BN_HUNDRED_THOUSAND,M as BN_MILLION,N as BN_ONE,P as BN_TEN,J as BN_TEN_BILLIONS,R as BN_TEN_MILLIONS,q as BN_TEN_THOUSAND,v as BN_THOUSAND,K as BN_TRILLION,I as BN_ZERO,wt as Mangata,Tt as MangataHelpers,yt as fromBN,ht as isBuyAssetTransactionSuccessful,ft as isSellAssetTransactionSuccessful,U as signTx,lt as toBN,mt as toFixed};
