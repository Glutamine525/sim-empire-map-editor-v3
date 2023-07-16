import React from 'react';
import Image from 'next/image';
import styles from './index.module.css';

const FixedBuildingIcon = () => {
  return (
    <div className={styles.container}>
      <Image
        width={10}
        height={10}
        alt="pin"
        src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iNCINCiAgdmlld0JveD0iMCAwIDQ4IDQ4IiBhcmlhLWhpZGRlbj0idHJ1ZSIgZm9jdXNhYmxlPSJmYWxzZSIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiDQogIGNsYXNzPSJhcmNvLWljb24gYXJjby1pY29uLXB1c2hwaW4iIHN0eWxlPSJmb250LXNpemU6IDMycHg7Ij4NCiAgPHBhdGgNCiAgICBkPSJNMTkuOTIxIDI4LjE2MyA3LjE5MyA0MC44OW0xMi43MjgtMTIuNzI4IDguODg0IDguODgzYy4xNy4xNy40NDcuMTcuNjE3IDBsNS4xMi01LjEyYTcuODYyIDcuODYyIDAgMCAwIDEuNjY3LTguNjU1LjA5My4wOTMgMCAwIDEgLjAyLS4xMDJsNC45MDYtNC45MDZhMiAyIDAgMCAwIDAtMi44MjhMMzIuNjQ4IDYuOTVhMiAyIDAgMCAwLTIuODI4IDBsLTQuODkgNC44ODlhLjEyNi4xMjYgMCAwIDEtLjEzOS4wMjcgNy44MjggNy44MjggMCAwIDAtOC42MTggMS42NmwtNS4wMjcgNS4wMjZhLjU5MS41OTEgMCAwIDAgMCAuODM2bDguNzc0IDguNzc1WiI+DQogIDwvcGF0aD4NCjwvc3ZnPg=="
      />
    </div>
  );
};

export default FixedBuildingIcon;
