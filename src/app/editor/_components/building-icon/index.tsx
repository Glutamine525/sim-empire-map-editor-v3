import React, { FC } from 'react';
import Image from 'next/image';
import { getColorTypeByBg } from '@/utils/color';
import styles from './index.module.css';

interface BuildingIconProps {
  type: 'fixed' | 'special';
  bg?: string;
}

const icon: { [key: string]: string } = {
  fixed:
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iNCINCiAgdmlld0JveD0iMCAwIDQ4IDQ4IiBhcmlhLWhpZGRlbj0idHJ1ZSIgZm9jdXNhYmxlPSJmYWxzZSIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiDQogIGNsYXNzPSJhcmNvLWljb24gYXJjby1pY29uLXB1c2hwaW4iIHN0eWxlPSJmb250LXNpemU6IDMycHg7Ij4NCiAgPHBhdGgNCiAgICBkPSJNMTkuOTIxIDI4LjE2MyA3LjE5MyA0MC44OW0xMi43MjgtMTIuNzI4IDguODg0IDguODgzYy4xNy4xNy40NDcuMTcuNjE3IDBsNS4xMi01LjEyYTcuODYyIDcuODYyIDAgMCAwIDEuNjY3LTguNjU1LjA5My4wOTMgMCAwIDEgLjAyLS4xMDJsNC45MDYtNC45MDZhMiAyIDAgMCAwIDAtMi44MjhMMzIuNjQ4IDYuOTVhMiAyIDAgMCAwLTIuODI4IDBsLTQuODkgNC44ODlhLjEyNi4xMjYgMCAwIDEtLjEzOS4wMjcgNy44MjggNy44MjggMCAwIDAtOC42MTggMS42NmwtNS4wMjcgNS4wMjZhLjU5MS41OTEgMCAwIDAgMCAuODM2bDguNzc0IDguNzc1WiI+DQogIDwvcGF0aD4NCjwvc3ZnPg==',
  special:
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAAllBMVEUAAAD//wD//wD//wD//wD//wD//wD//wD//wD//wD//wD//wD//wD//wD//wD//wD//wD//wD//wD//wD//wD//wD//wD//wD//wD//wD//wD//wD//wD//wD//wD//wD//wD//wD//wD//wD//wD//wD//wD//wD//wD//wD//wD//wD//wD//wD//wD//wD//wD//wAuEJ6+AAAAMXRSTlMA/PYTiQwI8uizBOXg2cCudGhiSSLsu3htZkQxLaWCfFdPOjbMjnBdVLWdmI1cG6dWgQ3CcgAAAahJREFUSMftVNl2gjAUDASUHdlkV8R9bfn/n2tuItAoaeG1p/OAZjJzRpO5oD8Lo66NSYayaZazCfpFQxCP16sRGCJ1SsCkiJkGcoiYEDCfk8diZIBJtKsVeWjjDuoAARhDxGF0gIKQMjYioQEI0Yjkt0aEQfIMYBFmEoTDHQkzb6/bUkMhY6CwzFaSre+9LOTkntZ8h8LYG0eaXq/fStzW8kljh6OlbWdIO1JzLnHQ/+g8vjh9eB9R0IRzlauDVcyrM00oem4NhJwhATL699dv/ZQ3w/qA14sdYj3AA1Y6ves3oB9qVSqB4/hKfxJaUBGfOgqeDCjpo0HcYdPhuSXo70gAuECLp3aESpEIJ+jFe8JJaICxvPHUHsZVaHDJrs9TPqFcocEmu1vWn2yjsiITyhZOM5wS6IyUVDSKZ+CEUxJNds4OyfDN58j4pOgW+ZILDEeyp6PKbjrYFdLJx1FgUODe4ODZm49i59CRHYbetJAVjBW5W+oCg9UO7/UBy8e1HXVLYIiYvAxbIiyZRRPeG8RzdS305oebw6Xl1q9k7VofGP1jIr4ARpdRUmC+q1YAAAAASUVORK5CYII=',
};

const BuildingIcon: FC<BuildingIconProps> = props => {
  const { type, bg = '#000000' } = props;

  return (
    <div
      className={styles.container}
      style={{
        filter: Array(2)
          .fill(
            `drop-shadow(0 0 1px ${
              getColorTypeByBg(bg) === 'dark' ? '#ababab' : '#ffffff'
            })`,
          )
          .join(' '),
      }}
    >
      <Image width={10} height={10} alt="pin" src={icon[type]} />
    </div>
  );
};

export default BuildingIcon;
