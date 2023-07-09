import { CatalogType } from '@/app/editor/_map-core/building/type';
import imageResidence from '@/assets/images/住宅.png';
import imageMilitary from '@/assets/images/军事.png';
import imageAgriculture from '@/assets/images/农业.png';
import imageDelete from '@/assets/images/删除建筑.png';
import imageCancel from '@/assets/images/取消操作.png';
import imageCommerce from '@/assets/images/商业.png';
import imageWonder from '@/assets/images/奇迹.png';
import imageReligion from '@/assets/images/宗教.png';
import imageImportExport from '@/assets/images/导入导出.png';
import imageIndustry from '@/assets/images/工业.png';
import imageMunicipal from '@/assets/images/市政.png';
import imageUndo from '@/assets/images/撤销.png';
import imageCulture from '@/assets/images/文化.png';
import imageWatermarkMode from '@/assets/images/水印模式.png';
import imageSpecial from '@/assets/images/特殊建筑.png';
import imageMove from '@/assets/images/移动建筑.png';
import imageDecoration from '@/assets/images/美化.png';
import imageGeneral from '@/assets/images/通用.png';
import imageRoad from '@/assets/images/道路.png';
import imageRedo from '@/assets/images/重做.png';

export const catalogImageMap = {
  [CatalogType.Road]: imageRoad,
  [CatalogType.Residence]: imageResidence,
  [CatalogType.Agriculture]: imageAgriculture,
  [CatalogType.Industry]: imageIndustry,
  [CatalogType.Commerce]: imageCommerce,
  [CatalogType.Municipal]: imageMunicipal,
  [CatalogType.Culture]: imageCulture,
  [CatalogType.Religion]: imageReligion,
  [CatalogType.Military]: imageMilitary,
  [CatalogType.Decoration]: imageDecoration,
  [CatalogType.Wonder]: imageWonder,
  [CatalogType.General]: imageGeneral,
  [CatalogType.Special]: imageSpecial,
  [CatalogType.Cancel]: imageCancel,
  [CatalogType.Move]: imageMove,
  [CatalogType.Delete]: imageDelete,
  [CatalogType.Undo]: imageUndo,
  [CatalogType.Redo]: imageRedo,
  [CatalogType.WatermarkMode]: imageWatermarkMode,
  [CatalogType.ImportExport]: imageImportExport,
};
