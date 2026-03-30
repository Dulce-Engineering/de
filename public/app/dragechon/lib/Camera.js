class Camera
{
  static New(scene)
  {
    const camera = scene.cameras.main;
    camera.startFollow(scene.game.ctx.player);
    camera.setZoom(1);
    //camera.useBounds = false;
    //camera.setSize(1000, 1000);
    //camera.setSize(window.innerWidth, window.innerHeight);
    //camera.setViewport(0, 0, window.innerWidth, window.innerHeight);

    camera.Update = Camera.Update.bind(camera);

    return camera;
  }

  static Update(scene, delta)
  {
    this.rotation = -scene.game.ctx.player.rotation;
  }
}

export default Camera;