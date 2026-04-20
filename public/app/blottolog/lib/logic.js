class Logic
{
  static MS_PER_HOUR = 3600000;
  static BURN_OFF_RATE = 0.015; // BAC reduction per hour
  static TARGET_BAC = 0.035;    // The "Sweet Spot" threshold
  static ABSORPTION_DELAY = 45 / 60; // Assume 45 mins to peak absorption

  /**
   * Calculates the minutes to wait until the next drink.
   * @param {Array} drinks - Array of drink objects.
   * @param {Object} user - {sex, age, weight, height} weight in kg, height in cm.
   * @returns {number} Minutes to wait.
   */
  static Get_Wait_Time_To_Next_Drink(drinks, user, time)
  {
    const r = Logic.Get_Widmark_Distribution_Factor(user);

    // 2. Calculate current cumulative BAC
    const currentTotalBac = drinks.reduce
      ((total, d) => total + Logic.Get_Drink_Contribution(d, time, user, r), 0);

    // 3. Logic: If under target, wait is 0. If over, calculate decay time.
    if (currentTotalBac <= Logic.TARGET_BAC)
    {
      return 0;
    }

    // Solve for time: (CurrentBAC - Target) / BurnRate
    const hoursToWait = (currentTotalBac - Logic.TARGET_BAC) / Logic.BURN_OFF_RATE;

    return Math.round(hoursToWait * 60);
  }

  /**
   * Calculates the BAC contribution of a single drink at a specific time.
   *
   * @param {Object} drink - The drink record.
   * @param {Object} drink.drink_size - Drink size details.
   * @param {number} drink.drink_size.ml - Volume of the drink in milliliters.
   * @param {Object} drink.drink_type - Drink type details.
   * @param {number} drink.drink_type.alc_vol - Alcohol by volume percentage.
   * @param {number} drink.start_time - Timestamp when the drink was started.
   * @param {number} time - The evaluation timestamp in milliseconds.
   * @param {Object} user - User body metrics.
   * @param {number} user.weight - Weight in kilograms.
   * @param {number} r - Widmark distribution factor for the user.
   * @returns {number} Estimated BAC contribution from this drink at the given time.
   */
  static Get_Drink_Contribution(drink, time, user, r)
  {
    const hoursSinceStart = (time - drink.start_time) / Logic.MS_PER_HOUR;

    // If we haven't even started the drink, it contributes nothing yet
    if (hoursSinceStart < 0) return 0;

    // Grams of pure ethanol: ml * (abv/100) * density
    const grams = drink.drink_size.ml * (drink.drink_type.alc_vol / 100) * 0.789;

    // Theoretical Max BAC from this drink
    const maxBac = (grams / (user.weight * 1000 * r)) * 100;

    // Simple Linear Absorption Model:
    // Alcohol peaks at ABSORPTION_DELAY, then begins elimination.
    let absorbedAmount = Math.min(1, hoursSinceStart / Logic.ABSORPTION_DELAY);
    let currentBac = maxBac * absorbedAmount;

    // Subtract elimination (burn-off)
    const elimination = Logic.BURN_OFF_RATE * hoursSinceStart;

    return Math.max(0, currentBac - elimination);
  }

  /**
   * Calculates the Widmark r-factor (volume of distribution) for a user.
   *
   * @param {Object} user - User body metrics.
   * @param {string} user.sex - 'male' or 'female'.
   * @param {number} user.weight - Weight in kilograms.
   * @param {number} user.height - Height in centimeters.
   * @returns {number} The Widmark distribution factor.
   */
  static Get_Volume_Distribution_Factor(user)
  {
    return (user.sex === 'male')
      ? 0.31608 - (0.004821 * user.weight) + (0.004321 * user.height)
      : 0.31223 - (0.006446 * user.weight) + (0.004466 * user.height);
  }

  /**
   * Bateman Equation for BAC
   * @param {number} grams - Mass of pure ethanol consumed (g)
   * @param {number} Vd - Volume of distribution (Liters)
   * @param {number} t - Time since consumption (Hours)
   * @param {number} ka - Absorption rate constant (e.g., 1.5 - 2.5)
   * @param {number} ke - Elimination rate constant (e.g., 0.1 - 0.2)
   * @returns {number} Current BAC as a percentage (g/100mL)
   */
  static Bateman_BAC(grams, Vd, t, ka = 2.0, ke = 0.15)
  {
    if (t <= 0) return 0;

    // The core Bateman Formula:
    // C(t) = (A * ka / (Vd * (ka - ke))) * (exp(-ke * t) - exp(-ka * t))

    const doseOverVolume = grams / Vd;
    const rateFactor = ka / (ka - ke);
    const decay = Math.exp(-ke * t) - Math.exp(-ka * t);

    const concentrationGL = doseOverVolume * rateFactor * decay;

    // Convert g/L to g/100mL (Percentage)
    // Divide by 10 because 100mL is 1/10th of a Liter.
    return Math.max(0, concentrationGL / 10);
  } 
}

export default Logic;