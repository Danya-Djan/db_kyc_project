from decimal import Decimal
from django.contrib import admin
from django.forms import ModelForm, CharField
from misc.models import Setting


class SettingForm(ModelForm):
    value = CharField(label='Значение')

    class Meta:
        model = Setting
        exclude = ('value',)

    def save(self, commit=True):
        setting = super(SettingForm, self).save(commit=False)
        setting.value = dict()
        if self.cleaned_data['value'].isdigit():
            setting.value['value'] = int(self.cleaned_data['value'])
        elif self.cleaned_data['value'] in ('true', 'false'):
            setting.value['value'] = self.cleaned_data['value'] == 'true'
        else:
            setting.value['value'] = self.cleaned_data['value']

        if commit:
            setting.save()

        return setting


@admin.register(Setting)
class SettingAdmin(admin.ModelAdmin):
    form = SettingForm
    list_display = [
        'id',
        'name',
        'description',
        'display_value'
    ]
    list_display_links = [
        'id'
    ]