const ServiceRating = artifacts.require("ServiceRating");

contract("ServiceRating", (accounts) => {
    let serviceRatingInstance;

    before(async () => {
        serviceRatingInstance = await ServiceRating.deployed();
    });

    it("should rate a service", async () => {
        const user = accounts[0];
        const rating = 4;

        const tx = await serviceRatingInstance.rateService(rating, { from: user });
        assert.equal(tx.logs[0].event, "ServiceRated", "ServiceRated event should be emitted");

        const ratedService = await serviceRatingInstance.ratings(0);
        assert.equal(ratedService.user, user, "User address should match");
        assert.equal(ratedService.rating, rating, "Rating should match");
    });

    it("should calculate average rating", async () => {
        // Rate the service multiple times with different ratings
        await serviceRatingInstance.rateService(4, { from: accounts[0] });
        await serviceRatingInstance.rateService(5, { from: accounts[1] });
        // await serviceRatingInstance.rateService(3, { from: accounts[2] });

        // Get the average rating
        const averageRating = await serviceRatingInstance.getAverageRating();

        // // Convert the average rating to a floating-point number
        // const averageRatingFloat = web3.utils.fromWei(averageRating.toString(), "ether");

        // Assert that the average rating matches the expected value
        assert.equal(averageRating, 4, "Average rating should match");
    });
});
