import * as React from 'react';

export function House(props: React.SVGAttributes<SVGElement>) {
  return (
    <svg viewBox="0 0 48 48" {...props}>
      <path d="M21.6062 5.85517C23.0048 4.71494 24.9952 4.71494 26.3938 5.85517L39.5688 16.5966C40.4736 17.3342 41 18.4492 41 19.628V39.1134C41 41.2599 39.2875 43 37.175 43H32.075C29.9625 43 28.25 41.2599 28.25 39.1134V29.7492C28.25 29.0337 27.6792 28.4536 26.975 28.4536H21.025C20.3208 28.4536 19.75 29.0337 19.75 29.7492V39.1134C19.75 41.2599 18.0375 43 15.925 43H10.825C8.71251 43 7 41.2599 7 39.1134V19.628C7 18.4493 7.52645 17.3342 8.43124 16.5966L21.6062 5.85517Z" />
    </svg>
  );
}
