//Sellers
{
  "$class": "org.acme.pv.auction.Member", "balance": 200,
  "email": "seller1@vt.edu",
  "firstName": "seller1", "lastName": "seller1"
}

{
  "$class": "org.acme.pv.auction.Member", "balance": 200,
  "email": "seller2@vt.edu",
  "firstName": "seller2", "lastName": "seller2"
}

//Buyer
{
  "$class": "org.acme.pv.auction.Member", "balance": 200,
  "email": "buyer1@vt.edu",
  "firstName": "buyer1", "lastName": "buyer1"
}

{
  "$class": "org.acme.pv.auction.Member", "balance": 200,
  "email": "buyer2@vt.edu",
  "firstName": "buyer2", "lastName": "buyer2"
}

{
  "$class": "org.acme.pv.auction.Member", "balance": 200,
  "email": "buyer3@vt.edu",
  "firstName": "buyer3", "lastName": "buyer3"
}

//pvoffer
{ "$class": "org.acme.pv.auction.PVOffer",
"reservePrice": 0,
"kWhavailable": 6,
"listingid": "resource:org.acme.pv.auction.KWhlisting#01Mar2020-16:00",
 "pv": "resource:org.acme.pv.auction.Member#seller1@vt.edu"
 }

 {"$class": "org.acme.pv.auction.PVOffer",
"reservePrice": 0,
"kWhavailable": 6,
"listingid": "resource:org.acme.pv.auction.KWhlisting#01Mar2020-16:00",
 "pv": "resource:org.acme.pv.auction.Member#seller2@vt.edu"
}



//buyoffers

{"$class": "org.acme.pv.auction.BUYOffer",
"BidPrice": 3,
"kWhQuantity": 5,
"listingid": "resource:org.acme.pv.auction.KWhlisting#01Mar2020-16:00", "member": "resource:org.acme.pv.auction.Member#buyer1@vt.edu"
}

{"$class": "org.acme.pv.auction.BUYOffer",
"BidPrice": 3,
"kWhQuantity": 3,
"listingid": "resource:org.acme.pv.auction.KWhlisting#01Mar2020-16:00",
"member": "resource:org.acme.pv.auction.Member#buyer2@vt.edu"}

{"$class": "org.acme.pv.auction.BUYOffer",
"BidPrice": 3,
"kWhQuantity": 1,
"listingid": "resource:org.acme.pv.auction.KWhlisting#01Mar2020-16:00",
"member": "resource:org.acme.pv.auction.Member#buyer3@vt.edu"
}


//closbidding

{
  "$class": "org.acme.pv.auction.CloseBidding",
  "listingid": "resource:org.acme.pv.auction.KWhlisting#01Mar2020-16:00"
}
