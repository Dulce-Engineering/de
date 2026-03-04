class Home extends Phaser.GameObjects.Sprite
{
  constructor(scene, x, y, player)
  {
    super(scene, x, y, 'home');
    this.player = player;
    this.setDepth(0);

    scene.add.existing(this);
    scene.physics.add.existing(this, true);

    scene.physics.add.overlap
      (player, this, this.On_Player_Overlap, null, this);

    scene.events.on('update', this.update, this);
  }

  On_Player_Overlap()
  {
    this.scene.Game_Over();
  }

  update(time, delta)
  {
    this.angle = this.player.angle;
  }
}

export default Home;