export class Validators {

  static stringIsRequired(value: string): boolean | string {
    if (!(value || '').trim()) return 'Поле обов\'язкове';
    return true;
  }
}