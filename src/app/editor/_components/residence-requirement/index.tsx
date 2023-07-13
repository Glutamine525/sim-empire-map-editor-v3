import React, { FC, Fragment, useMemo } from 'react';
import { shallow } from 'zustand/shallow';
import { getSelectedBuilding } from '@/utils/building';
import { isInBuildingRange, parseBuildingKey } from '@/utils/coordinate';
import useMapCore from '../../_hooks/use-map-core';
import {
  BuildingConfig,
  BuildingType,
  CivilBuilding,
} from '../../_map-core/building/type';
import { OperationType } from '../../_map-core/type';
import { useMapConfig } from '../../_store/map-config';
import styles from './index.module.css';

interface ResidenceRequirementProps extends BuildingConfig {
  row: number;
  col: number;
}

const ResidenceRequirement: FC<ResidenceRequirementProps> = props => {
  const { row, col, w = 1, h = 1, name = '' } = props;

  const mapCore = useMapCore();
  const [civil, changeOperation, changeBrush] = useMapConfig(
    state => [state.civil, state.changeOperation, state.changeBrush],
    shallow,
  );

  const requirement = useMemo<
    { [key in BuildingType]?: string[] } | undefined
  >(() => {
    if (name !== '普通住宅' && name !== '高级住宅') {
      return undefined;
    }
    return CivilBuilding[civil][`${name}需求`];
  }, [name, civil]);

  const result = useMemo(() => {
    if (!requirement) {
      return undefined;
    }
    const res: {
      [key in BuildingType]?: { name: string; covered: boolean }[];
    } = {};
    for (const _catalog in requirement) {
      const catalog = _catalog as BuildingType;
      res[catalog] = [];
      const catalogBuilding = CivilBuilding[civil][catalog];
      for (const reqName of requirement[catalog]!) {
        const range = catalogBuilding.find(v => v.name === reqName)?.range;
        if (typeof range === 'undefined') {
          continue;
        }
        let covered = false;
        for (let i = row - range; i < row + h + range; i++) {
          if (covered) {
            break;
          }
          for (let j = col - range; j < col + w + range; j++) {
            if (covered) {
              break;
            }
            const { occupied } = mapCore.cells[i][j];
            if (!occupied) {
              continue;
            }
            const [occupiedRow, occupiedCol] = parseBuildingKey(occupied);
            const b = mapCore.buildings[occupied];
            if (b.catalog !== catalog || b.name !== reqName) {
              continue;
            }
            for (let cornerRow of [row, row + h - 1, row, row + h - 1]) {
              if (covered) {
                break;
              }
              for (let cornerCol of [col, col, col + w - 1, col + w - 1]) {
                if (
                  isInBuildingRange(
                    cornerRow,
                    cornerCol,
                    occupiedRow,
                    occupiedCol,
                    b.w!,
                    b.h!,
                    range,
                  )
                ) {
                  covered = true;
                  break;
                }
              }
            }
          }
        }
        res[catalog]?.push({ name: reqName, covered });
      }
    }
    return res;
  }, [civil, requirement, row, col]);

  if (!result) {
    return '未知错误，请尝试刷新页面重试~';
  }

  return (
    <div className={styles.container}>
      {Object.keys(result).map(_catalog => {
        const catalog = _catalog as BuildingType;
        return (
          <Fragment key={catalog}>
            <div className={styles.catalog}>{catalog}</div>
            <div className={styles['item-container']}>
              {result[catalog]?.map(data => {
                return (
                  <div key={data.name}>
                    <span
                      className={styles.item}
                      onClick={() => {
                        changeOperation(OperationType.PlaceBuilding);
                        changeBrush(
                          getSelectedBuilding(
                            civil,
                            catalog,
                            CivilBuilding[civil][catalog].find(
                              v => v.name === data.name,
                            )!,
                          ),
                        );
                      }}
                    >
                      {data.name}:{' '}
                      <span
                        style={{
                          color: data.covered
                            ? 'rgb(var(--success-5))'
                            : 'rgb(var(--danger-5))',
                        }}
                      >
                        {data.covered ? '√' : 'x'}
                      </span>
                    </span>
                  </div>
                );
              })}
            </div>
          </Fragment>
        );
      })}
    </div>
  );
};

export default ResidenceRequirement;
