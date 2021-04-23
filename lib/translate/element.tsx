import React from 'react';

import { useLanguagePack } from '@/hooks/useLanguagePack';

import calculateHash from './hash.js';
import { Param as ParamType } from './param';
import { substitute } from './substitute';

type LanguagePack = ReturnType<typeof useLanguagePack>;

interface ParamProps extends ParamType {
  children: React.ReactNode;
}

export function Param(props: ParamProps) {
  return <>{props.children}</>;
}

type Child = string | React.ReactElement<ParamProps>;

function childIsElement(child: Child): child is React.ReactElement<ParamProps> {
  return typeof child !== 'string';
}

export function makeText(children: Child[]) {
  return children
    .map(child => (childIsElement(child) ? `%%${child.props.name}` : child))
    .join('');
}

export interface Props {
  children: Child | Child[];
}

export function getPhrases(languagePack: LanguagePack, props: Props) {
  const children = Array.isArray(props.children)
    ? props.children
    : [props.children];

  const text = makeText(children);
  const hash = calculateHash(text);
  const translation = languagePack.translations[hash] || {
    template: text,
    reference: text,
    variations: {
      [hash]: text,
    },
  };
  const substitutions = children.filter(childIsElement);

  const phrases = substitute({
    translation,
    substitutions,
    getParam: s => s.props,
    getValue: s => s,
  });

  return phrases;
}

export function Translate(props: Props) {
  const languagePack = useLanguagePack();
  const phrases = getPhrases(languagePack, props);

  return <>{phrases}</>;
}
