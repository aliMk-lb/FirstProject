import { getImgPath } from '@/utils/image';
import Image from 'next/image';
import Link from 'next/link';

const Logo: React.FC = () => {
  return (
    <Link href="/">
      <Image
        src={getImgPath('/images/logo/logo.png')}
        alt="logo"
        width={105}
        height={55}
        quality={100}
        className="dark:hidden"
      />
      <Image
        src={getImgPath('/images/logo/logo-white.png')}
        alt="logo"
        width={105}
        height={55}
        quality={100}
        className="hidden dark:block"
      />
    </Link>
  );
};

export default Logo;
