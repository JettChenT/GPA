import { Modal } from "react-daisyui";
import { useState } from "react";
import qrcode from "./assets/miniprogram.jpeg"

export default () => {
    const [visible, setVisible] = useState<boolean>(false)

    const toggleVisible = () => {
      setVisible(!visible)
    }
    return (
        <div className="inline-block">
            <button className="link link-hover" onClick={toggleVisible}>Mini Program</button>
            <Modal open={visible} onClickBackdrop={toggleVisible}>
                <Modal.Header className="font-bold">
                    Mobile version
                </Modal.Header>
                <Modal.Body>
                    <img src={qrcode}/>
                </Modal.Body>
            </Modal>
        </div>
    )
}