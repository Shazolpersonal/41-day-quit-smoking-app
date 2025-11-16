/**
 * Splash Screen Tests
 */

import React from 'react';
import {render} from '@testing-library/react-native';
import {SplashScreen} from '../SplashScreen';

jest.useFakeTimers();

describe('SplashScreen', () => {
  it('should render correctly', () => {
    const onFinish = jest.fn();
    const {getByText} = render(<SplashScreen onFinish={onFinish} />);

    expect(getByText('৪১ দিনে ধূমপান মুক্তি')).toBeTruthy();
    expect(getByText('ইসলামিক পথনির্দেশনা সহ')).toBeTruthy();
    expect(getByText('আল্লাহর সাহায্যে সফলতা')).toBeTruthy();
    expect(getByText('সংস্করণ ১.০.০')).toBeTruthy();
  });

  it('should display logo icon', () => {
    const onFinish = jest.fn();
    const {getByText} = render(<SplashScreen onFinish={onFinish} />);

    expect(getByText('☪️')).toBeTruthy();
  });

  it('should call onFinish after timeout', () => {
    const onFinish = jest.fn();
    render(<SplashScreen onFinish={onFinish} timeout={2500} />);

    expect(onFinish).not.toHaveBeenCalled();

    jest.advanceTimersByTime(2500);

    expect(onFinish).toHaveBeenCalledTimes(1);
  });

  it('should call onFinish with custom timeout', () => {
    const onFinish = jest.fn();
    render(<SplashScreen onFinish={onFinish} timeout={1500} />);

    jest.advanceTimersByTime(1500);

    expect(onFinish).toHaveBeenCalledTimes(1);
  });

  it('should not call onFinish before timeout', () => {
    const onFinish = jest.fn();
    render(<SplashScreen onFinish={onFinish} timeout={2500} />);

    jest.advanceTimersByTime(1000);

    expect(onFinish).not.toHaveBeenCalled();
  });

  it('should cleanup timer on unmount', () => {
    const onFinish = jest.fn();
    const {unmount} = render(<SplashScreen onFinish={onFinish} />);

    unmount();
    jest.advanceTimersByTime(3000);

    expect(onFinish).not.toHaveBeenCalled();
  });
});
