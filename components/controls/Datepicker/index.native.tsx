import React, { useState } from 'react';
import { Modal, SafeAreaView } from 'react-native';
import { CalendarList } from 'react-native-calendars';
import styled, { useTheme } from 'styled-components/native';

import { Input } from '@/components/controls/Input/index.native';
import { Calendar as _CalendarIcon } from '@/components/icons/Calendar/index.native';
import { useDateFormatter } from '@/hooks/useDateFormatter';
import { useRangeSelection } from '@/hooks/useDateSelection';
import { today } from '@/lib/date';

import { markDays, value as computeValue } from './_common';
import { ModalHeader } from './ModalHeader/index.native';

interface Props<R extends boolean> {
  label: string;
  maxDate?: Date;
  minDate?: Date;
  range?: R;
  onSelect?: R extends true
    ? (dates: [Date | null, Date | null]) => void
    : (date: Date | null) => void;
}

const CalendarIcon = styled(_CalendarIcon)`
  margin-top: -16px;
  position: absolute;
  right: 9px;
  top: 50%;
`;

const Container = styled.View`
  position: relative;
`;

const ModalBackground = styled.View`
  background-color: ${props => props.theme.background};
  height: 100%;
  width: 100%;
`;

const TapArea = styled.Pressable`
  bottom: 0;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
`;

export function Datepicker<R extends boolean>(props: Props<R>) {
  const { label, minDate, maxDate, range, onSelect } = props;

  const [format] = useDateFormatter({});
  const [isOpen, setIsOpen] = useState(false);
  const [{ start, end }, select] = useRangeSelection(range, onSelect);
  const theme = useTheme();

  return (
    <Container>
      <Input label={label} value={computeValue(start, end, format)} />
      <CalendarIcon height={32} width={32} fill={theme.primary} />
      <TapArea onPress={() => setIsOpen(true)} />
      <Modal
        animationType="slide"
        presentationStyle="overFullScreen"
        visible={isOpen}
        onRequestClose={(...args) => setIsOpen(false)}
      >
        <ModalBackground>
          <SafeAreaView>
            <ModalHeader
              done={(!range && !!start) || (range && !!start && !!end)}
              title={label}
              onClose={() => setIsOpen(false)}
            />
            <CalendarList
              onDayPress={({ timestamp }) => select(new Date(timestamp))}
              markedDates={markDays(theme, range, start, end)}
              markingType="period"
              minDate={minDate || today()}
              maxDate={maxDate}
              pastScrollRange={0}
              theme={{
                backgroundColor: theme.background,
                calendarBackground: theme.background,
                dayTextColor: theme.onBackground,
                monthTextColor: theme.primary,
                selectedDayBackgroundColor: theme.primary,
                selectedDayTextColor: theme.background,
                textDisabledColor: theme.disabled,
                textSectionTitleColor: theme.primary,
                todayTextColor: theme.primary,
              }}
            />
          </SafeAreaView>
        </ModalBackground>
      </Modal>
    </Container>
  );
}
