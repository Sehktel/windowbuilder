/**
 * ### Слушатель события экспорта в dxf
 * Created by Evgeniy Malyarov on 24.11.2017.
 */

export default function ($p) {
  $p.md.on('dxf', (scheme) => {
    import('@jscad/openjscad')
      .then((jscad) => import('./exec_dxf')
        .then(({exec_dxf}) => exec_dxf(scheme, jscad)));
  });
}
