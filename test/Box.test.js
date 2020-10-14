// test/Box.test.js
// Load dependencies
const { expect } = require('chai');

// Import utilities from Test Helpers
const { BN, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');

const { accounts, contract } = require('@openzeppelin/test-environment');

// Load compiled artifacts
const Box = contract.fromArtifact('Box');

// Start test block
describe('Box', function () {
    const [ owner, other ] = accounts;
    const value = new BN('42');

    beforeEach(async function () {
        // Deploy a new Box contract for each test
        this.contract = await Box.new( { from: owner });
    });

    // Test case
    it('retrieve returns a value previously stored', async function () {
        // Store a value
        await this.contract.store(value, {from: owner});

        // Test if the returned value is the same one
        // Note that we need to use strings to compare the 256 bit integers
        expect(await this.contract.retrieve()).to.be.bignumber.equal(value);
    });

    it('store emits an event', async function () {
        const receipt = await this.contract.store(value, {from: owner});

        expectEvent(receipt, 'ValueChanged', {newValue: value});
    });

    
});

describe('Box2', function () {
    const [owner, other] = accounts;
    const value = new BN('42');

    beforeEach(async function () {
        this.contract = await Box.new( { from: owner });
    });

    it('non owner cannot store a value', async function () {
        await expectRevert(
            this.contract.store(value, { from: other }),
            'Ownable: caller is not the owner'
        );
    });
});