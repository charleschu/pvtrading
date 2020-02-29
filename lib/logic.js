/**
 * New script file
 */


/**
 * submit pvoffer transaction from seller
 * @param {org.acme.pv.auction.PVOffer} pvoffer - the PVOffer transaction
 * @transaction
 */
async function PVOffer(pvoffer) {  // eslint-disable-line no-unused-vars

    const kwhlisting = pvoffer.listingid;
    const seller = pvoffer.pv;

    console.log(seller.firstName + seller.lastName + ' Offer kwh ' + pvoffer.kWhavailable + ' to KWhlisting ' + kwhlisting.$identifier + ' by price ' + kwhlisting.reservePrice);

    if (kwhlisting.pvoffers) {
        kwhlisting.pvoffers.push(pvoffer);
    } else {
        kwhlisting.pvoffers = [pvoffer];
    }

    // Update the kwhlisting
    const KWhlistingRegistry = await getAssetRegistry('org.acme.pv.auction.KWhlisting');
    await KWhlistingRegistry.update(kwhlisting);
}

/**
 * submit buyoffer transaction from buyer
 * @param {org.acme.pv.auction.BUYOffer} buyoffer - the BUYOffer transaction
 * @transaction
 */
async function BUYOffer(buyoffer) {  // eslint-disable-line no-unused-vars

    const kwhlisting = buyoffer.listingid;
      const buyer = buyoffer.member;

    console.log(buyer.firstname + buyer.lastname + ' Buy kwh ' + buyoffer.kWhQuantity + ' to     KWhlisting ' + kwhlisting.$identifier + ' by price ' + kwhlisting.BidPrice);

    if (kwhlisting.buyoffers && kwhlisting.buyoffers != 0) {
          let n = kwhlisting.buyoffers.length;
        for (let i=0; i < n; i++){
          if(kwhlisting.buyoffers[i].BidPrice < buyer.BidPrice){
            kwhlisting.buyoffers.splice( i, 0, item );
            break;
          } else if(i==n-1){
               kwhlisting.buyoffers.push(buyoffer);
          }
        }
    } else {
        kwhlisting.buyoffers = [buyoffer];
    }

    // Update the kwhlisting
    const KWhlistingRegistry = await getAssetRegistry('org.acme.pv.auction.KWhlisting');
    await KWhlistingRegistry.update(kwhlisting);
}


/**
 * submit buyoffer transaction from buyer
 * @param {org.acme.pv.auction.AcceptOfferBroadcast} acceptofferbroadcase - the AcceptOfferBroadcast transaction
 * @transaction
 */
async function AcceptOfferBroadcast(acceptofferbroadcase) {  // eslint-disable-line no-unused-vars

    const factory = getFactory();
    const NS = 'org.acme.pv.auction';

  // create the kwhlisting
      console.log('Kwhlisting create at: ' + acceptofferbroadcase.timestamp);
    const kwhlisting = factory.newResource(NS, 'KWhlisting', '01Mar2020-16:00'); // Hardcode time for testing
    kwhlisting.state = 'ACCEPT_OFFERS';
    kwhlisting.pvoffers = [];
    kwhlisting.buyoffers = [];
 //   const tomorrow = setupDemo.timestamp;
 //   tomorrow.setDate(tomorrow.getDate() + 1);
    let starEvent = factory.newEvent(NS, 'StartOfferEvent');
    starEvent.kwhlisting = kwhlisting;
    var message = 'Start accept offers for 2020-Mar-01-16:00~17:00 now';
    starEvent.message = message;
    emit(starEvent);
    // add the kwhlistings
    const KWhlistingRegistry = await getAssetRegistry(NS + '.KWhlisting');
    await KWhlistingRegistry.addAll([kwhlisting]);
}


/**
 * submit CloseBidding transaction from
 * @param {org.acme.pv.auction.CloseBidding} closebidding - the CloseBidding transaction
 * @transaction
 */
async function CloseBidding(closebidding) {
//TODO: 1. missing the senario: buyer balance is not enough
//      2. multi pvoffer/buyoffer from the same seller/buyer
    const factory = getFactory();
    const NS = 'org.acme.pv.auction';
    const kwhlisting = closebidding.listingid;
    kwhlisting.state = 'AUCTION_CLOSED';
    let endEvent = factory.newEvent(NS, 'EndOfferEvent');
    endEvent.kwhlisting = kwhlisting;
    var message = 'End accept offers for 2020-Mar-01-16:00~17:00 now';
    endEvent.message = message;
    emit(endEvent);
    let AllKwh = 0;
    let AllBid = 0;
    kwhlisting.buyoffers.forEach(function(buyoffer, index, array) {
          console.log(buyoffer, index)
          AllBid = AllBid + buyoffer.kWhQuantity * buyoffer.BidPrice;
          AllKwh = AllKwh + buyoffer.kWhQuantity;
    })
    let mcp = AllBid/AllKwh;
    console.log("******************" + "mcp: " + mcp);
     currentKwhavailiable = 0;
     currentKwhquantity = 0;
     currentPvofferIndex = 0;
    for (const buy_offer of kwhlisting.buyoffers) {
        console.log('---------------------------------' + buy_offer.member.email)
        await updateBalance(mcp, kwhlisting, buy_offer)
    }


    // Update the kwhlisting
    const KWhlistingRegistry = await getAssetRegistry('org.acme.pv.auction.KWhlisting');
    await KWhlistingRegistry.update(kwhlisting);
}

async function updateBalance(mcp, kwhlisting, buyoffer ) {
  let pvoffer = kwhlisting.pvoffers[currentPvofferIndex];
          if(!pvoffer){
            console.log('*********no availaible pvoffer, stop************');
            return false;
         }
        console.log('xxxx '+ 'currentKwhquantity: '+ currentKwhquantity + ' currentKwhavailiable: ' + currentKwhavailiable +' xxxx')
          currentKwhquantity  = currentKwhquantity || buyoffer.kWhQuantity;
          currentKwhavailiable = currentKwhavailiable || pvoffer.kWhavailable;
          let buyer = buyoffer.member;
          let seller = pvoffer.pv;
          console.log("++++++buyer " + buyer.$identifier + " buy: " + currentKwhquantity);
          console.log("++++++seller " + seller.$identifier + " availiable: " + currentKwhavailiable );
          const MemberRegistry = await getParticipantRegistry('org.acme.pv.auction.Member');
          if (currentKwhavailiable > currentKwhquantity){
            let usedBalance = currentKwhquantity * mcp;
            currentKwhavailiable = currentKwhavailiable - currentKwhquantity;
            currentKwhquantity = 0;
            seller.balance = seller.balance + usedBalance;
            buyer.balance = buyer.balance - usedBalance;
            console.log("===============1buyer:  " + buyer.email)
            console.log("===============1seller:  " + seller.email)
            console.log("===============1buyer balance:  " + buyer.balance)
            console.log("================1seller balance:  " + seller.balance)
        await MemberRegistry.update(seller);
        await MemberRegistry.update(buyer);
            console.log("11111111111111111111111111111111111111111111")
            return;
        } else if(currentKwhavailiable == currentKwhquantity){
            let usedBalance = currentKwhavailiable * mcp;
          currentKwhavailiable = 0;
          currentKwhquantity = 0;
            seller.balance = seller.balance + usedBalance;
          buyer.balance = buyer.balance - usedBalance;
            console.log("===============2buyer:  " + buyer.email)
            console.log("===============2seller:  " + seller.email)
            console.log("================2buyer balance:  " + buyer.balance)
            console.log("================2seller balance:  " + seller.balance)
             // Update the seller&buyer
        await MemberRegistry.update(seller);
        await MemberRegistry.update(buyer);
           console.log("22222222222222222222222222222222222222")
           currentPvofferIndex = currentPvofferIndex + 1;
           return;
        } else {
            let usedBalance = currentKwhavailiable * mcp;
            currentKwhquantity = currentKwhquantity - currentKwhavailiable;
            currentKwhavailiable = 0
            seller.balance = seller.balance + usedBalance;
            buyer.balance = buyer.balance - usedBalance;
            console.log("===============3buyer:  " + buyer.email)
            console.log("===============3seller:  " + seller.email)
            console.log("================3buyer balance:  " + buyer.balance)
            console.log("================3seller balance:  " + seller.balance)
             // Update the seller&buyer
        await MemberRegistry.update(seller);
        await MemberRegistry.update(buyer);
            console.log("3333333333333333333333333333333333333333333333")
            currentPvofferIndex = currentPvofferIndex + 1;
          await updateBalance(mcp, kwhlisting, buyoffer );
            return;
        }
}
