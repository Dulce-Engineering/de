class Input
{
  cursors = null;
  gamma = 0;

  constructor(scene, window)
  {
    this.On_Window_Tilt = this.On_Window_Tilt.bind(this);

    this.cursors = scene.input.keyboard.createCursorKeys();
    if (window.DeviceOrientationEvent) 
    {
      window.addEventListener('deviceorientation', this.On_Window_Tilt);
    }
  }

  Get_Speed(delta)
  {
    let speed = 100;

    const SPEED = 100; // base pixels per second
    if (this.cursors)
    {
      const frame_scale = delta ? (delta / 16.6667) : 1;
      if (this.cursors.up.isDown)
      {
        speed = SPEED * frame_scale;
      }
    }

    return speed;
  }

  Get_Delta_Angle(delta)
  {
    let delta_angle = 0;

    const ROTATION_SPEED = 1.8; // base degrees per frame
    if (this.cursors)
    {
      const frame_scale = delta ? (delta / 16.6667) : 1;
      const rotation_amount = ROTATION_SPEED * frame_scale;
      if (this.cursors.left.isDown)
      {
        delta_angle = -rotation_amount;
      }
      else if (this.cursors.right.isDown)
      {
        delta_angle = rotation_amount;
      }
    }

    // also respond to device tilt
    delta_angle += this.gamma/2;

    return delta_angle;
  }

  On_Window_Tilt(event)
  {
    this.gamma = event.gamma;
  }
}

export default Input;
