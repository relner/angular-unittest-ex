import { TestBed } from '@angular/core/testing';

import { CalcService } from './calc.service';

let service;
describe('CalcService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(CalcService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add two digits', () => {
    expect(service.Invoke('2+3')).toBe(5);
  });

  it('should add multi digits', () => {
    expect(service.Invoke('12+13')).toBe(25);
  });

  it('should trow an error', () => {
    expect(() => {
      service.Invoke('54+33d')
    }).toThrowError('Yous string not correct');
  });

  it('should to solve a multi components task without order', () => {
    expect(service.CalcTask('2+2*2')).toBe(8);
  });

  it('should to solve a multi components task without order - second example', () => {
    expect(service.CalcTask('12+5*7/4-2')).toBe(27.75);
  });

  it('should to solve a multi components task with order', () => {
    expect(service.Invoke('2+2*2')).toBe(6);
  });

  it('should to solve a multi components task with order', () => {
    expect(service.Invoke('12+5*7/4-2')).toBe(18.75);
  });

  it('should to solve a multi components task with order and floating point numbers', () => {
    expect(service.CalcTask('3.5+12.3')).toBe(15.8);
  });

  it('should to solve a multi components task with spaces', () => {
    expect(service.CalcTask('12   +   5')).toBe(17);
  });

  it('temp test for check HandleStringBrackets', () => {
    expect(service.HandleStringBrackets('2*(2+2)')).toBe('2*4');
  });

  it('should to solve a multi components task with brackets', () => {
    expect(service.Invoke('2*(2+2)')).toBe(8);
  });

  it('should to solve a multi components task with brackets - second example', () => {
    expect(service.Invoke('(1+2)*(3+4)')).toBe(21);
  });

  it('should to solve a multi components task with brackets - three example', () => {
    expect(service.Invoke('2*(15-(4+2))')).toBe(18);
  });

  it('should to solve a multi components task with functions', () => {
    expect(service.Invoke('Sin(1)')).toBe(0.8415);
  });



});
