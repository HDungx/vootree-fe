"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { Avatar, Select } from "antd";
import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import Image from "next/legacy/image";

const { Option } = Select;

const LanguageSwitcher = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const locale = useLocale();

  const [selectedLanguage, setSelectedLanguage] = useState(locale);

  const switchLanguage = (value: string) => {
    const lang = value;
    const params = new URLSearchParams(searchParams.toString());
    let newPath = `/${lang}${pathname}`;
    if (lang === "vi") {
      newPath = pathname.startsWith("/en") ? pathname.slice(3) : pathname;
    }
    router.push(`${newPath}?${params.toString()}`);
  };

  useEffect(() => {
    setSelectedLanguage(locale);
  }, [locale]);

  return (
    <div>
      <Select
        value={selectedLanguage}
        onChange={switchLanguage}
        style={{ width: 100 }}
      >
        <Option value="en">
          <div className="items-center flex">
            <Image
              alt=""
              src="/icon/united-kingdom.png"
              width={22}
              height={22}
            />
            <p className="ms-2">EN</p>
          </div>
        </Option>
        <Option value="vi">
          <div className="items-center flex">
            <Image alt="" src="/icon/vietnam.png" width={22} height={22} />
            <p className="ms-2">VI</p>
          </div>
        </Option>
      </Select>
    </div>
  );
};

export default LanguageSwitcher;
