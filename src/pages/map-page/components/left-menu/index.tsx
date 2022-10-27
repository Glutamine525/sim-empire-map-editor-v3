import { Menu, Typography } from '@arco-design/web-react';
import React, { useEffect, useRef, useState } from 'react';
import styles from './index.module.less';
import { getImgUrl } from '@/utils/url';
import Scrollbar from 'smooth-scrollbar';
import { BuildingType, CatalogType, CivilBuilding, SimpleBuilding } from '@/map-core/building';
import { GeneralBuilding } from '@/map-core/building/general';
import { useDispatch, useSelector } from 'react-redux';
import { mapSelector } from '@/store/selectors';
import { changeBrush, changeOperation } from '@/store/reducers/map-reducer';
import { OperationType } from '@/map-core/type';

const { Text } = Typography;
const MenuItem = Menu.Item;
const SubMenu = Menu.SubMenu;

const LeftMenu = () => {
  const leftMenuRef = useRef<HTMLDivElement>();

  const { civil } = useSelector(mapSelector);
  const d = useDispatch();

  const [openKeys, setOpenKeys] = useState([CatalogType.Municipal]);
  const [catalog, setCatalog] = useState<{ [key in CatalogType]: { name: string }[] }>({
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
    Scrollbar.init(leftMenuRef.current!, { damping: 0.2 });
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
    <div className={styles.container}>
      <Menu
        ref={leftMenuRef}
        style={{ width: 180, height: '100%' }}
        selectable={false}
        accordion={true}
        openKeys={openKeys}
        onClickSubMenu={(v) => {
          if (v === openKeys[0]) {
            setOpenKeys([]);
            return;
          }
          setOpenKeys([v as CatalogType]);
        }}
        onClickMenuItem={(_, __, path) => {
          console.log(path);
          if (
            path.length === 2 &&
            Object.entries(BuildingType)
              .map(([_, v]) => v as string)
              .includes(path[1])
          ) {
            const type = path[1] as BuildingType;
            const record: SimpleBuilding = CivilBuilding[civil][type].find(
              (v) => v.name === path[0],
            )!;
            d(changeOperation(OperationType.PlaceBuilding));
            d(
              changeBrush({
                width: record.size,
                height: record.size,
                range: record.range,
                backgroundColor: record.background,
                name: record.name,
                text: record.text,
                catalog: path[1] as CatalogType,
                isProtection:
                  type === BuildingType.Municipal &&
                  CivilBuilding[civil]['防护'].includes(record.name),
                isWonder: type === BuildingType.Wonder || record.isPalace,
                isDecoration: type === BuildingType.Decoration,
              }),
            );
            return;
          }
          switch (path[0]) {
            case CatalogType.Road:
              d(changeOperation(OperationType.PlaceBuilding));
              d(
                changeBrush({
                  width: 1,
                  height: 1,
                  name: CatalogType.Road,
                  catalog: CatalogType.Road,
                  isRoad: true,
                }),
              );
              break;
            default:
              d(changeOperation(OperationType.Empty));
              break;
          }
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
  );
};

export default LeftMenu;
