import { Col, Row } from "antd";
import Image from "next/legacy/image";
import React from "react";

export default function Footer() {
  return (
    <>
      <div className="bg-gray-800 px-10 py-10" style={{ height: 400 }}>
        <div className="items-center justify-center flex">
          <Image src="/logo_preview_rev_2.png" width={200} height={80} alt="" />
        </div>
        <div>
          <ul className="items-center justify-center flex mt-8">
            <li className="p-5">
              <Image src="/icon/google-1.png" alt="" width={40} height={40} />
            </li>
            <li className="p-5">
              <Image
                src="/icon/facebook-app-symbol.png"
                alt=""
                width={40}
                height={40}
              />
            </li>
            <li className="p-5">
              <Image src="/icon/instagram.png" alt="" width={40} height={40} />
            </li>
            <li className="p-5">
              <Image src="/icon/youtube.png" alt="" width={40} height={40} />
            </li>
          </ul>
        </div>
        <div className="items-center flex justify-center mt-8 text-white">
          <p>© Copyright 2024 VooTreeVeeVuu - All Rights Reserved</p>
        </div>
      </div>
    </>
  );
}
