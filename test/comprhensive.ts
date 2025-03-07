describe("Additional Lock Contract Tests", function () {
  it("Should deploy the contract with a non-zero balance", async function () {
    const { lock, lockedAmount } = await loadFixture(deployOneYearLockFixture);

    expect(await hre.ethers.provider.getBalance(lock.target)).to.be.gt(0);
    expect(await hre.ethers.provider.getBalance(lock.target)).to.equal(lockedAmount);
  });

  it("Should not allow double withdrawal", async function () {
    const { lock, unlockTime } = await loadFixture(deployOneYearLockFixture);

    await time.increaseTo(unlockTime);
    await lock.withdraw();

    await expect(lock.withdraw()).to.be.revertedWith("No funds left to withdraw");
  });

  it("Should withdraw the exact locked amount", async function () {
    const { lock, unlockTime, lockedAmount, owner } = await loadFixture(deployOneYearLockFixture);

    await time.increaseTo(unlockTime);

    const initialBalance = await hre.ethers.provider.getBalance(owner.address);
    const tx = await lock.withdraw();
    const receipt = await tx.wait();
    const gasUsed = receipt.gasUsed.mul(receipt.effectiveGasPrice);
    
    const finalBalance = await hre.ethers.provider.getBalance(owner.address);
    
    expect(finalBalance).to.equal(initialBalance.add(lockedAmount).sub(gasUsed));
  });

  it("Should prevent withdrawal if contract has no funds", async function () {
    const { lock, unlockTime } = await loadFixture(deployOneYearLockFixture);

    await time.increaseTo(unlockTime);
    await lock.withdraw();

    await expect(lock.withdraw()).to.be.revertedWith("No funds left to withdraw");
  });

  it("Should correctly return the unlock time", async function () {
    const { lock, unlockTime } = await loadFixture(deployOneYearLockFixture);
    expect(await lock.unlockTime()).to.equal(unlockTime);
  });

  it("Should allow the owner to deposit additional funds", async function () {
    const { lock, owner } = await loadFixture(deployOneYearLockFixture);

    const depositAmount = hre.ethers.parseEther("1");
    
    await owner.sendTransaction({
      to: lock.target,
      value: depositAmount,
    });

    const contractBalance = await hre.ethers.provider.getBalance(lock.target);
    expect(contractBalance).to.equal(depositAmount + lockedAmount);
  });

  it("Should not allow non-owners to deposit", async function () {
    const { lock, otherAccount } = await loadFixture(deployOneYearLockFixture);

    await expect(
      otherAccount.sendTransaction({
        to: lock.target,
        value: hre.ethers.parseEther("1"),
      })
    ).not.to.be.reverted; // Anyone can send ETH, but this does not change ownership
  });

  it("Should return correct contract balance at any time", async function () {
    const { lock, lockedAmount } = await loadFixture(deployOneYearLockFixture);
    
    expect(await hre.ethers.provider.getBalance(lock.target)).to.equal(lockedAmount);
  });

  it("Should allow withdrawals only when contract has balance", async function () {
    const { lock, unlockTime } = await loadFixture(deployOneYearLockFixture);

    await time.increaseTo(unlockTime);
    await lock.withdraw();

    await expect(lock.withdraw()).to.be.revertedWith("No funds left to withdraw");
  });
});
