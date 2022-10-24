import { Menu, Typography } from '@arco-design/web-react';
import React, { useEffect, useRef, useState } from 'react';
import styles from './index.module.less';
import { getImgUrl } from '@/utils/url';
import Scrollbar from 'smooth-scrollbar';
import { BuildingType, CatalogType, CivilBuilding, SimpleBuilding } from '@/map-core/building';
import { GeneralBuilding } from '@/map-core/building/general';
import { useSelector } from 'react-redux';
import { mapSelector } from '@/store/selectors';

const { Text } = Typography;
const MenuItem = Menu.Item;
const SubMenu = Menu.SubMenu;

const LeftMenu = () => {
  const menuRef = useRef<HTMLDivElement>();

  const { civil } = useSelector(mapSelector);

  const [openKeys, setOpenKeys] = useState([CatalogType.Municipal]);
  const [catalog, setCatalog] = useState<{ [key in CatalogType]: SimpleBuilding[] }>({
    [CatalogType.Road]: [],
    [CatalogType.Residence]: [],
    [CatalogType.Agriculture]: [],
    [CatalogType.Industry]: [],
    [CatalogType.Commerce]: [],
    [CatalogType.Municipal]: [],
    [CatalogType.Culture]: [],
    [CatalogType.Religion]: [],
    [CatalogType.Military]: [],
    [CatalogType.Decoration]: [],
    [CatalogType.Wonder]: [],
    [CatalogType.General]: GeneralBuilding,
    [CatalogType.Special]: [],
    [CatalogType.Cancel]: [],
    [CatalogType.Select]: [],
    [CatalogType.Delete]: [],
    [CatalogType.WatermarkMode]: [],
    [CatalogType.ImportExport]: [{ name: '导入新文明' }, { name: '导入地图' }, { name: '截图' }],
  });

  useEffect(() => {
    Scrollbar.init(menuRef.current!, { damping: 0.2 });
  }, []);

  useEffect(() => {
    const newCatalog = {
      [BuildingType.Residence]: CivilBuilding[civil][BuildingType.Residence],
      [BuildingType.Agriculture]: CivilBuilding[civil][BuildingType.Agriculture],
      [BuildingType.Industry]: CivilBuilding[civil][BuildingType.Industry],
      [BuildingType.Commerce]: CivilBuilding[civil][BuildingType.Commerce],
      [BuildingType.Municipal]: CivilBuilding[civil][BuildingType.Municipal],
      [BuildingType.Culture]: CivilBuilding[civil][BuildingType.Culture],
      [BuildingType.Religion]: CivilBuilding[civil][BuildingType.Religion],
      [BuildingType.Military]: CivilBuilding[civil][BuildingType.Military],
      [BuildingType.Decoration]: CivilBuilding[civil][BuildingType.Decoration],
      [BuildingType.Wonder]: CivilBuilding[civil][BuildingType.Wonder],
    };
    setCatalog((catalog: any) => ({ ...catalog, ...newCatalog }));
  }, [civil]);

  return (
    <div>
      <div className={[styles.container].join(' ')}>
        <Menu
          ref={menuRef}
          style={{ height: '100%' }}
          selectable={false}
          tooltipProps={{ disabled: true }}
          accordion={true}
          openKeys={openKeys}
          onClickSubMenu={(v) => setOpenKeys([v as CatalogType])}
          onClickMenuItem={(_, __, path) => {
            if (path.length === 1) {
              return;
            }
            console.log(path);
          }}>
          {Object.entries(catalog).map(([c, sub]) => {
            return !sub.length ? (
              <MenuItem key={c}>
                <img className={styles['menu-icon']} src={getImgUrl(`${c}.png`)} />
                <Text bold>{c}</Text>
              </MenuItem>
            ) : (
              <SubMenu
                key={c}
                title={
                  <>
                    <img className={styles['menu-icon']} src={getImgUrl(`${c}.png`)} />
                    <Text bold>{c}</Text>
                  </>
                }>
                {sub.map((v, i) => (
                  <MenuItem key={v.name}>
                    <Text type="secondary">
                      {i + 1}. {v.name}
                    </Text>
                  </MenuItem>
                ))}
              </SubMenu>
            );
          })}
        </Menu>
      </div>
    </div>
  );
};

export default LeftMenu;
