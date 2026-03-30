const COHESION_WEIGHT = 1.1;   // How strongly pigs are attracted to the center of their neighbors
const ALIGNMENT_WEIGHT = 1.2;  // How strongly pigs try to match the average velocity
const SEPARATION_WEIGHT = 1.2; // How strongly pigs try to avoid crowding. Usually the highest weight.
const PLAYER_FLEE_RADIUS = 100;
const FLEE_WEIGHT = 1.0;       // How strongly pigs flee from the player.
const MAX_SPEED = 150;
const STEERING_FORCE = 0.05; // A small value (0 to 1) for gentle steering (lerp factor)

class Pig
{
  static New_Group(scene)
  {
    const pigs_def = 
    {
      key: 'star', 
      repeat: 50, 
      active: true, 
      visible: true, 
      collideWorldBounds: true
    };
    const pigs = scene.physics.add.group(pigs_def);

    // Place pigs randomly within the world bounds
    Phaser.Actions.RandomRectangle(pigs.getChildren(), 
      new Phaser.Geom.Rectangle(0, 0, scene.game.config.width, scene.game.config.height));
    
    pigs.children.iterate(For_Each, scene);
    function For_Each(pig)
    {
      pig.setBounce(1);

      // Give each pig a random initial velocity
      const initialSpeed = Phaser.Math.Between(50, 150);
      const initialAngle = Phaser.Math.FloatBetween(0, 2 * Math.PI);
      scene.physics.velocityFromRotation(initialAngle, initialSpeed, pig.body.velocity);

      pig.Update = Pig.Update.bind(pig);
    }

    return pigs;
  }

  static Update(scene, delta)
  {
    const vel = this.body.velocity;

    const neighbours = Pig.Get_Stars_In_Radius(this, 100, scene.game.ctx.pigs);
    let desiredDirection = new Phaser.Math.Vector2(0, 0);

    const cohesion = Pig.Calculate_Cohesion_Vector(this, neighbours);
    desiredDirection.add(cohesion.normalize().scale(COHESION_WEIGHT));

    const alignment = Pig.Calculate_Alignment_Vector(neighbours);
    desiredDirection.add(alignment.normalize().scale(ALIGNMENT_WEIGHT));

    const separation = Pig.Calculate_Separation_Vector(this, neighbours);
    desiredDirection.add(separation.normalize().scale(SEPARATION_WEIGHT));

    const flee = Pig.Calculate_Flee_Vector_From_Player(this, scene.game.ctx.player, PLAYER_FLEE_RADIUS);
    desiredDirection.add(flee.normalize().scale(FLEE_WEIGHT));

    if (desiredDirection.length() > 0)
    {
      const desiredVelocity = desiredDirection.normalize().scale(MAX_SPEED);
      vel.lerp(desiredVelocity, STEERING_FORCE);
    }

    if (vel.lengthSq() > 0.0001) 
    {
      this.rotation = vel.angle();
    }
  }

  static Update_Group(scene, delta)
  {
    for (const pig of scene.game.ctx.pigs.getChildren())
    {
      pig.Update(scene, delta);
    }
  }

  static Get_Stars_In_Radius(center_pig, radius, pigs)
  {
    const nearbyStars = [];
    pigs.getChildren().forEach(pig => 
    {
      if (pig !== center_pig) 
      {
        const distance = Phaser.Math.Distance.Between
          (center_pig.x, center_pig.y, pig.x, pig.y);
        if (distance <= radius) 
        {
          nearbyStars.push(pig);
        }
      }
    });
    return nearbyStars;
  }

  /**
   * Calculates a vector pointing towards the average position of a group of neighbors.
   * This is the "cohesion" component of a flocking algorithm.
   * @param {Phaser.Physics.Arcade.Sprite} pig The pig to calculate the vector for.
   * @param {Phaser.Physics.Arcade.Sprite[]} neighbours An array of neighboring pigs.
   * @returns {Phaser.Math.Vector2} A vector representing the direction towards the center of the neighbors.
   */
  static Calculate_Cohesion_Vector(pig, neighbours)
  {
    if (neighbours.length === 0) {
      return new Phaser.Math.Vector2(0, 0); // Return a zero vector if no neighbors
    }

    // Calculate the average position (center of mass) of the neighbors
    let averageX = 0;
    let averageY = 0;
    neighbours.forEach(n => {
      averageX += n.x;
      averageY += n.y;
    });
    averageX /= neighbours.length;
    averageY /= neighbours.length;

    // Create a vector pointing from the current pig to the center of mass.
    const cohesionVector = new Phaser.Math.Vector2(averageX - pig.x, averageY - pig.y);

    return cohesionVector;
  }

  /**
   * Calculates a vector representing the average heading of a group of neighbors.
   * This is the "alignment" component of a flocking algorithm.
   * @param {Phaser.Physics.Arcade.Sprite[]} neighbours An array of neighboring stars.
   * @returns {Phaser.Math.Vector2} A vector representing the average velocity of the neighbors.
   */
  static Calculate_Alignment_Vector(neighbours)
  {
    if (neighbours.length === 0) 
    {
      return new Phaser.Math.Vector2(0, 0); // Return a zero vector if no neighbors
    }

    // Calculate the average velocity of the neighbors
    const averageVector = new Phaser.Math.Vector2(0, 0);
    neighbours.forEach(n => 
    {
      averageVector.add(n.body.velocity);
    });

    return averageVector.scale(1 / neighbours.length);
  }

  /**
   * Calculates a repulsion vector to steer a pig away from the player.
   * The force is inversely proportional to the distance, meaning it's very strong
   * when close and weak when far away.
   * @param {Phaser.Physics.Arcade.Sprite} pig The pig to calculate the vector for.
   * @param {Phaser.Physics.Arcade.Sprite} player The player object to flee from.
   * @param {number} fleeRadius The radius within which the pig will start fleeing.
   * @returns {Phaser.Math.Vector2} A vector representing the repulsion force from the player.
   */
  static Calculate_Flee_Vector_From_Player(pig, player, fleeRadius)
  {
    const fleeVector = new Phaser.Math.Vector2(0, 0);
    const distance = Phaser.Math.Distance.Between(pig.x, pig.y, player.x, player.y);

    if (distance > 0 && distance < fleeRadius) {
      // Calculate a vector pointing away from the player.
      const repulsionForce = new Phaser.Math.Vector2(pig.x - player.x, pig.y - player.y);
      // The force is inversely proportional to the distance. Closer player pushes harder.
      fleeVector.add(repulsionForce.normalize().scale(1 / distance));
    }

    return fleeVector;
  }

  /**
   * Calculates a vector to steer away from crowded neighbors.
   * This is the "separation" component of a flocking algorithm.
   * @param {Phaser.Physics.Arcade.Sprite} pig The pig to calculate the vector for.
   * @param {Phaser.Physics.Arcade.Sprite[]} neighbours An array of neighboring pigs.
   * @returns {Phaser.Math.Vector2} A vector representing the direction to steer to avoid crowding.
   */
  static Calculate_Separation_Vector(pig, neighbours)
  {
    const separationVector = new Phaser.Math.Vector2(0, 0);
    if (neighbours.length === 0) {
      return separationVector;
    }

    neighbours.forEach(n => {
      const distance = Phaser.Math.Distance.Between(pig.x, pig.y, n.x, n.y);
      
      if (distance > 0) {
        // Calculate a vector pointing away from the neighbor.
        const repulsionForce = new Phaser.Math.Vector2(pig.x - n.x, pig.y - n.y);
        // The force is inversely proportional to the distance. Closer neighbors push harder.
        separationVector.add(repulsionForce.normalize().scale(1 / distance));
      }
    });

    return separationVector;
  }
}

export default Pig;