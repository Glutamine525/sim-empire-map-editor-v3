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
import { getGeneralBuilding, getRoadBuilding, getSelectedBuilding } from '@/utils/building';
import { mapRef } from '../map';
import downloader from 'js-file-download';
import { getMapImageName } from '@/utils/file';

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
    [CatalogType.Move]: [],
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
            d(changeBrush(getSelectedBuilding(civil, type, record)));
            return;
          }
          if (path[1] === CatalogType.General) {
            d(changeOperation(OperationType.PlaceBuilding));
            d(changeBrush(getGeneralBuilding(parseInt(path[0], 10))));
            return;
          }
          switch (path[0]) {
            case CatalogType.Road:
              d(changeOperation(OperationType.PlaceBuilding));
              d(changeBrush(getRoadBuilding()));
              break;
            case '选中建筑':
              d(changeOperation(OperationType.MoveBuilding));
              break;
            case '截图':
              (async () => {
                downloader(
                  (await mapRef.current?.toBlob({
                    mimeType: 'image/jpeg',
                    quality: 1,
                    pixelRatio: 1.5,
                  })) as Blob,
                  getMapImageName(),
                  'image/jpeg',
                );
              })();
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
