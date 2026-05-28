import Utils from "../../../../lib/Utils.js";

class DeInfo extends HTMLElement
{
  static tname = "de-info";

  queue = [];

  constructor()
  {
    super();
    Utils.Bind(this, "On_");
    this.Info = this.Info.bind(this);
  }

  connectedCallback()
  {
    this.Render();
  }

  Info(msg)
  {
    if (!this.hasAttribute("no-op"))
    {
      this.queue.push(msg);
      this.Process();
    }
  }

  async Process()
  {
    if (!this.is_processing)
    {
      this.is_processing = true;

      while (this.queue.length > 0)
      {
        const msg = this.queue.shift();
        if (msg)
        {
          this.progress_dlg.showModal();
          await this.Show_Msg(msg);
        }
        else if (this.progress_dlg.open)
        {
          await this.Hide_Msg();
          this.progress_dlg.close();
        }
      }

      this.is_processing = false;
    }
  }

  async Show_Msg(msg)
  {
    await this.Hide_Msg();

    this.info_elem.last_msg = msg;
    await this.Animate(msg, true);
  }

  async Hide_Msg()
  {
    const msg = this.info_elem.last_msg;
    if (msg)
    {
      await this.Animate(msg, false);
      this.info_elem.textContent = "";
      this.info_elem.last_msg = null;
    }
  }

  On_Cancel_Dlg()
  {
    event.preventDefault();
  }

  async Animate(msg, forward = true)
  {
    this.is_animating = true;
    const no_anim = this.hasAttribute("no-anim");
    if (no_anim)
    {
      this.info_elem.textContent = "[ " + msg + " ]";
    }
    else if (forward)
    {
      for (let c = 0; c <= msg.length; c++)
      {
        this.info_elem.textContent = "[ " + msg.substring(0, c) + " ]";
        await Utils.sleep(35);
      }
    }
    else
    {
      for (let c = msg.length; c >= 0; c--)
      {
        this.info_elem.textContent = "[ " + msg.substring(0, c) + " ]";
        await Utils.sleep(35);
      }
    }
    this.is_animating = false;

    this.dispatchEvent(new Event("completed"));
  }

  Render()
  {
    const html = `
      <dialog cid="progress_dlg">
        <output cid="info_elem" role="status"></output>
        <de-dial class="dial1" max-value="4" gap-width="20" value="4"></de-dial>
        <de-dial class="dial2" max-value="8" gap-width="30" value="8"></de-dial>
        <de-dial class="dial3" max-value="16" tick-width="2" value="16" viewbox-radius="140"></de-dial>
        <de-dial class="dial4" max-value="128" gap-width="3" value="128" viewbox-radius="140"></de-dial>
      </dialog>
    `;
    this.innerHTML = html;
    Utils.Set_Id_Shortcuts(this, this, "cid");

    this.progress_dlg.addEventListener('cancel', this.On_Cancel_Dlg);
  }
}

Utils.Register_Element(DeInfo);
export default DeInfo;