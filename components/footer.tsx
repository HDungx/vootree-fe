import { Col, Row } from "antd";
import Image from "next/legacy/image";
import React from "react";

export default function Footer() {
  return (
    <>
      <div className="bg-gray-800 px-10 py-10" style={{ height: 400 }}>
        <Row gutter={24}>
          <Col span={6}>
            <Image
              src="/logo_preview_rev_2.png"
              alt=""
              width={200}
              height={80}
            />
          </Col>
          <Col span={6}>
            <div className="mt-5">
              <p className="text-3xl text-white">Về VooTreeVeeVuu </p>
              <p></p>
            </div>
          </Col>
          <Col span={6}>
            <div className="mt-5  text-white ">
              <p className="text-3xl ">Liên hệ chúng tôi trên</p>

              <p className=" flex gap-4 mt-2">
                <Image src="/icon/facebook.png" width={40} height={40} alt="" />
                <Image src="/icon/google.png" width={40} height={40} alt="" />
              </p>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
}
