describe('auctionTest', function() {
  beforeEach(module('auction'));
  var controller, AuctionUtils, rootScope;
  beforeEach(inject(function(_$controller_, _$rootScope_, AuctionUtils) {
    rootScope = _$rootScope_.$new();
    controller = _$controller_('AuctionController', { AuctionUtils: AuctionUtils, $rootScope: rootScope });
  }));

  //$rootScope.post_bid
  it('should be Defined', function() {
    expect(rootScope.post_bid).toBeDefined();
  });
  it('should push alerts', function() {
    let length = rootScope.alerts.length;
    rootScope.form.bid = -1;
    expect(!!rootScope.post_bid()).toEqual(false);
    expect(rootScope.alerts.length).toEqual(length + 1);
  });
  it('should warn if the proposal you have submitted coincides with a proposal of the other participant bid', function() {
    let length = rootScope.alerts.length;
    rootScope.form.BidsForm = {};
    rootScope.form.BidsForm.$valid = true;
    rootScope.minimal_bid = { amount: 2 };
    rootScope.post_bid(2);
    expect(rootScope.alerts.length).toEqual(length + 1);
    expect(rootScope.alerts[0].msg && rootScope.alerts[0].type == 'warning').toEqual(true);
  });

  //$rootScope.edit_bid
  it('should be Defined', function() {
    expect(rootScope.edit_bid).toBeDefined();
  });
  it('should change allow_bidding', function() {
    rootScope.edit_bid();
    expect(rootScope.allow_bidding).toBe(true);
  });

  //$rootScope.max_bid_amount
  it('should be Defined', function() {
    expect(rootScope.max_bid_amount).toBeDefined();
  });
  it('should return 0', function() {
    expect(rootScope.max_bid_amount()).toBe(0);
  });
  it('should find max bid amount', function() {
    rootScope.bidder_id = '{}';
    rootScope.auction_doc = { current_stage: 0 };
    rootScope.auction_doc.stages = [{ amount: 3 }];
    rootScope.auction_doc.minimalStep = { amount: 1 }
    expect(rootScope.max_bid_amount()).toBe(4);
  });

  //$rootScope.calculate_minimal_bid_amount
  it('should be Defined', function() {
    expect(rootScope.calculate_minimal_bid_amount).toBeDefined();
  });
  it('should find minimal bid', function() {
    rootScope.auction_doc = {};
    rootScope.auction_doc.stages = [];
    rootScope.auction_doc.initial_bids = [{ amount: 1 }, { amount: 2 }, { amount: 3 }];
    rootScope.calculate_minimal_bid_amount();
    expect(rootScope.minimal_bid).toBeDefined(1);
    rootScope.auction_doc.initial_bids = [{ amount: 100000 }, { amount: 200000 }, { amount: 300000 }, { amount: 200000 }, { amount: 300000 }, { amount: 300000 }, { amount: 200000 }, { amount: 300000 }];
    expect(rootScope.minimal_bid).toBeDefined(100000);
  });

  //$rootScope.start_sync
  it('should be Defined', function() {
    expect(rootScope.start_sync).toBeDefined();
  });

  //$rootScope.start_auction_process
  it('should be Defined', function() {
    expect(rootScope.start_auction_process).toBeDefined();
  });

  //$rootScope.restart_changes
  it('should be Defined', function() {
    expect(rootScope.restart_changes).toBeDefined();
  });

  //$rootScope.replace_document
  it('should be Defined', function() {
    expect(rootScope.replace_document).toBeDefined();
  });

  //$rootScope.calculate_rounds
  it('should be Defined', function() {
    expect(rootScope.calculate_rounds).toBeDefined();
  });
  it('should work correct', function() {
    rootScope.auction_doc = { stages: [{ type: 'pause' }, { type: 'pause' }, 5, { type: 'pause' }, { type: 'pause' }, { type: 'pause' }] };
    rootScope.calculate_rounds();
    expect(rootScope.Rounds).toEqual([0, 1, 3, 4, 5]);
  });

  //$rootScope.scroll_to_stage
  it('should be Defined', function() {
    expect(rootScope.scroll_to_stage).toBeDefined();
  });

  //$rootScope.array
  it('should be Defined', function() {
    expect(rootScope.array).toBeDefined();
  });
  it('should return Array', function() {
    expect(rootScope.array() instanceof Array).toBe(true);
  });

  //$rootScope.open_menu
  it('should be Defined', function() {
    expect(rootScope.open_menu).toBeDefined();
  });

  //$rootScope.calculate_bid_temp
  it('should be Defined', function() {
    expect(rootScope.calculate_bid_temp).toBeDefined();
  });
  it('should be Defined', function() {
    rootScope.form.bid = 11;
    rootScope.bidder_coeficient = 4;
    rootScope.calculate_bid_temp();
    expect(rootScope.form.bid_temp).toBe(11);
    expect(rootScope.form.full_price).toBe(44);
  });

  //$rootScope.calculate_full_price_temp
  it('should be Defined', function() {
    expect(rootScope.calculate_full_price_temp).toBeDefined();
  });
  it('should work correct', function() {
    rootScope.form.full_price = 11;
    rootScope.bidder_coeficient = 3;
    rootScope.calculate_full_price_temp();
    expect(rootScope.form.full_price_temp).toBe(99);
    expect(rootScope.form.bid).toBe(33);
  });

  //$rootScope.set_bid_from_temp
  it('should be Defined', function() {
    expect(rootScope.set_bid_from_temp).toBeDefined();
  });
  it('should work correct', function() {
    rootScope.form.bid_temp = 0;
    rootScope.set_bid_from_temp();
    expect(rootScope.form.bid).toBe(0);
  });
});