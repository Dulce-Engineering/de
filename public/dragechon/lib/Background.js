
class Background extends Phaser.GameObjects.TileSprite
{
  player;
  
  constructor(scene, player)
  {
    const width = scene.game.config.width * 2;
    const height = scene.game.config.height * 2;
    super(scene, player.x, player.y, width, height, 'bk');
    
    this.player = player;
    this.setDepth(-1);
    
    scene.add.existing(this);
    scene.events.on('update', this.update, this);
  }

  update(time, delta)
  {
    this.x = this.player.x;
    this.y = this.player.y;
    this.tilePositionX = this.player.x;
    this.tilePositionY = this.player.y;
  }
}

export default Background;