import SequenceFeature from '../feature';


describe('sequence feature', function() {
  var oldFeature = function() {
    return {
      _id: 1,
      _type: "note",
      desc: "",
      name: "t8",
      ranges: [
      {
        from: 6,
        to: 7,
        reverseComplement: false,
      },
      {
        from: 16,
        to: 14,
        reverseComplement: true,
      }
      ]
    };
  }

  it('should make a new feature with correct ranges from an old feature', function() {
    var sequenceFeature = SequenceFeature.newFromOld(oldFeature());
    expect(sequenceFeature.ranges[0].from).toEqual(6);
    expect(sequenceFeature.ranges[0].to).toEqual(8);
    expect(sequenceFeature.ranges[0].reverse).toEqual(false);
    expect(sequenceFeature.ranges[1].from).toEqual(15);
    expect(sequenceFeature.ranges[1].to).toEqual(17);
    expect(sequenceFeature.ranges[1].reverse).toEqual(true);
  });
});
