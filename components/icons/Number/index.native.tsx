import React from 'react';
import { Svg, Path, SvgProps } from 'react-native-svg';

export function Number(props: SvgProps) {
  return (
    <Svg viewBox="0 0 24 24" {...props}>
      <Path d="M10.9848 3.16464C11.0756 2.61988 10.7076 2.10462 10.1629 2.01378C9.6181 1.92293 9.10284 2.29091 9.012 2.83567L8.15118 7.99772L3.99937 8.00016C3.44708 8.00049 2.99963 8.44847 2.99996 9.00075C3.00028 9.55304 3.44826 10.0005 4.00055 10.0002L7.81763 9.99791L7.15053 13.9983L2.99955 14.0002C2.44727 14.0004 1.99975 14.4483 2 15.0006C2.00025 15.5529 2.44816 16.0004 3.00045 16.0002L6.81699 15.9985L6.01034 20.8357C5.91949 21.3804 6.28747 21.8957 6.83223 21.9865C7.37699 22.0774 7.89225 21.7094 7.9831 21.1646L8.84475 15.9976L13.8203 15.9953L13.0136 20.8358C12.9228 21.3805 13.2908 21.8958 13.8356 21.9865C14.3803 22.0773 14.8956 21.7093 14.9863 21.1646L15.848 15.9944L20.0004 15.9926C20.5527 15.9923 21.0002 15.5444 21 14.9921C20.9998 14.4399 20.5518 13.9923 19.9996 13.9926L16.1814 13.9943L16.8483 9.9926L21.0005 9.99015C21.5528 9.98983 22.0003 9.54185 22 8.98956C21.9996 8.43728 21.5517 7.98983 20.9994 7.99015L17.1817 7.9924L17.9863 3.16456C18.0771 2.61978 17.7091 2.10456 17.1644 2.01376C16.6196 1.92297 16.1044 2.29099 16.0136 2.83576L15.1539 7.99359L10.179 7.99652L10.9848 3.16464ZM9.84545 9.99672L14.8206 9.99379L14.1537 13.9952L9.1783 13.9974L9.84545 9.99672Z" />
    </Svg>
  );
}
