import React, { FC } from 'react';
import Image from 'next/image';
import { getColorByBg } from '@/utils/color';
import styles from './index.module.css';

interface BuildingIconProps {
  type: 'fixed' | 'special';
  bg?: string;
}

const icon: { [key: string]: string } = {
  fixed:
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iNCINCiAgdmlld0JveD0iMCAwIDQ4IDQ4IiBhcmlhLWhpZGRlbj0idHJ1ZSIgZm9jdXNhYmxlPSJmYWxzZSIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiDQogIGNsYXNzPSJhcmNvLWljb24gYXJjby1pY29uLXB1c2hwaW4iIHN0eWxlPSJmb250LXNpemU6IDMycHg7Ij4NCiAgPHBhdGgNCiAgICBkPSJNMTkuOTIxIDI4LjE2MyA3LjE5MyA0MC44OW0xMi43MjgtMTIuNzI4IDguODg0IDguODgzYy4xNy4xNy40NDcuMTcuNjE3IDBsNS4xMi01LjEyYTcuODYyIDcuODYyIDAgMCAwIDEuNjY3LTguNjU1LjA5My4wOTMgMCAwIDEgLjAyLS4xMDJsNC45MDYtNC45MDZhMiAyIDAgMCAwIDAtMi44MjhMMzIuNjQ4IDYuOTVhMiAyIDAgMCAwLTIuODI4IDBsLTQuODkgNC44ODlhLjEyNi4xMjYgMCAwIDEtLjEzOS4wMjcgNy44MjggNy44MjggMCAwIDAtOC42MTggMS42NmwtNS4wMjcgNS4wMjZhLjU5MS41OTEgMCAwIDAgMCAuODM2bDguNzc0IDguNzc1WiI+DQogIDwvcGF0aD4NCjwvc3ZnPg==',
  special:
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABmJLR0QA/wD/AP+gvaeTAAADgklEQVRoge2YzYscRRjGf72MX2FX0F3XQ/AQXONBjW4OEfYcJBAURDCX5BLUrB/BgGiCiheFYMS7/4AfJwWNh6CIJyEevBgPGyWurK4mLn6sZtW4Oz8PUyO9lZqZnp5u5+A8UMxUV9XzPO9bPe9UN4wwwv8bWR2kSgO4O3RPZxnrdejUBuUNxdA+VK4atqfCUJ7OmW+3Z4ftqxCUcWUlEcCKMl6H5ljFfI8Bk4nrk8DjFWtVC2WLcj6R/Xb7sY5dqHIHHgWmc/1V4NdcfwqYr1CvOihXK99FGX9JeTG69oOyZdh+L4NyJDL6u3KDcr2yGo0dGbbfTQjZ/zYyeTw3fjwa+165ZpieN0E5nMj+dG58MrELh4dpuKHcrOwJ5pcjcycSa05Ec5bD2j2Bq1HWT/IspIwBNwG3RG07sA24ogPfGrAty7gQ8U0DX0PHH/DfYfws8GXUlrKMZuGIlPlwn3aq593ay114Xy3JuawFy6+yS9koKfRBD+7rlE9Kcm/ov6fbTYjvvVmK/bmdBxaAr2ht8xngVLcFWcbPwJyyE7iH1i05A9wK3NhDbyx4O911lnKnsp7IwPvKPmWnMlEgwL6gTATufUEr1l9X7ihK9nyC4KKyu2rjCe3dQSvWf65fomcSJH8q99XknVBS1xK6L5QlfEppRmR/KfdX7B1lr/LHwJlPEM8ngrikPFCRd5R7w+7mNZrKk1UJPJworevKgQq4HwwJic0/UYX3vNDBDkEUqwxpzr2JirehHKzSe15wf0Lw4wH4TiUSsr9Cy0nRQ5Ho4gBcn0Zch8rw9PtI+VPUP1tGNOCXHtyF0G8At0f9z8uIBpyJ+reVIRk0gC/KiHZYG3MXQr8PEnGWkgGE89IuYBz4KMv4LTEt3oFSARSGrWfffBVqxgc75UrlEVtvH9rzVpSjRs/Btt7iNaMqVN+zsjIbVY1zubGG8pCylDgOtNtSmNPIrTsXzZmtM4ADkdi7SmbrCLzQxXjcFsKaLHDkx/r+d+/nNxDf/xPAZ8BdHeavhs9ro+vbgbeAY1xeSktVokJQThbM8Jryiq3XKZPhe+qYnGon6wxgsYf4JeU1ZWti7dYwFh/c4rZYZwCp9/7tA9jrykwBjpkwt9OLgwu9OAYJ4O2E4HvKjhJcO8LamO+dOry3RadC9r4JwcxVwDkXuBaVN5WpKryOMMIII/x3+AfaUwe2ftpEsQAAAABJRU5ErkJggg==',
};

const BuildingIcon: FC<BuildingIconProps> = props => {
  const { type, bg = '#000000' } = props;

  return (
    <div
      className={styles.container}
      style={{
        filter: Array(2)
          .fill(`drop-shadow(0 0 1px ${getColorByBg(bg)})`)
          .join(' '),
      }}
    >
      <Image width={10} height={10} alt="pin" src={icon[type]} />
    </div>
  );
};

export default BuildingIcon;
