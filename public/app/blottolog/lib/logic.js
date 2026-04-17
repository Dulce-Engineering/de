class Logic
{
  /**
   * Calculates the minutes to wait until the next drink.
   * @param {Array} drinks - Array of drink objects.
   * @param {Object} user - {sex, age, weight, height} weight in kg, height in cm.
   * @returns {number} Minutes to wait.
   */
  Get_Wait_Time_To_Next_Drink(drinks, user)
  {
    const NOW = Date.now();
    const MS_PER_HOUR = 3600000;
    const BURN_OFF_RATE = 0.015; // BAC reduction per hour
    const TARGET_BAC = 0.035;    // The "Sweet Spot" threshold
    const ABSORPTION_DELAY = 45 / 60; // Assume 45 mins to peak absorption

    // 1. Calculate the Widmark r-factor (Volume of Distribution)
    // Using the Forrest Formula for better accuracy than basic Widmark
    let r = (user.sex === 'male')
      ? 0.31608 - (0.004821 * user.weight) + (0.004321 * user.height)
      : 0.31223 - (0.006446 * user.weight) + (0.004466 * user.height);

    /**
     * Calculates the BAC contribution of a single drink at a specific time.
     */
    function getDrinkContribution(drink, time)
    {
      const hoursSinceStart = (time - drink.start_time) / MS_PER_HOUR;

      // If we haven't even started the drink, it contributes nothing yet
      if (hoursSinceStart < 0) return 0;

      // Grams of pure ethanol: ml * (abv/100) * density
      const grams = drink.drink_size.ml * (drink.drink_type.alc_vol / 100) * 0.789;

      // Theoretical Max BAC from this drink
      const maxBac = (grams / (user.weight * 1000 * r)) * 100;

      // Simple Linear Absorption Model:
      // Alcohol peaks at ABSORPTION_DELAY, then begins elimination.
      let absorbedAmount = Math.min(1, hoursSinceStart / ABSORPTION_DELAY);
      let currentBac = maxBac * absorbedAmount;

      // Subtract elimination (burn-off)
      const elimination = BURN_OFF_RATE * hoursSinceStart;

      return Math.max(0, currentBac - elimination);
    }

    // 2. Calculate current cumulative BAC
    const currentTotalBac = drinks.reduce((total, d) => total + getDrinkContribution(d, NOW), 0);

    // 3. Logic: If under target, wait is 0. If over, calculate decay time.
    if (currentTotalBac <= TARGET_BAC)
    {
      return 0;
    }

    // Solve for time: (CurrentBAC - Target) / BurnRate
    const hoursToWait = (currentTotalBac - TARGET_BAC) / BURN_OFF_RATE;

    return Math.round(hoursToWait * 60);
  }
}

export default Logic;