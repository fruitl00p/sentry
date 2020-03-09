# -*- coding: utf-8 -*-
# Generated by Django 1.11.28 on 2020-03-09 15:39
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import sentry.db.models.fields.bounded
import sentry.db.models.fields.foreignkey


class Migration(migrations.Migration):
    # This flag is used to mark that a migration shouldn't be automatically run in
    # production. We set this to True for operations that we think are risky and want
    # someone from ops to run manually and monitor.
    # General advice is that if in doubt, mark your migration as `is_dangerous`.
    # Some things you should always mark as dangerous:
    # - Large data migrations. Typically we want these to be run manually by ops so that
    #   they can be monitored. Since data migrations will now hold a transaction open
    #   this is even more important.
    # - Adding columns to highly active tables, even ones that are NULL.
    is_dangerous = False

    # This flag is used to decide whether to run this migration in a transaction or not.
    # By default we prefer to run in a transaction, but for migrations where you want
    # to `CREATE INDEX CONCURRENTLY` this needs to be set to False. Typically you'll
    # want to create an index concurrently when adding one to an existing table.
    atomic = True


    dependencies = [
        ('sentry', '0049_auto_20200304_0254'),
    ]

    operations = [
        migrations.CreateModel(
            name='KeyTransaction',
            fields=[
                ('id', sentry.db.models.fields.bounded.BoundedBigAutoField(primary_key=True, serialize=False)),
                ('transaction', models.CharField(max_length=200)),
                ('organization', sentry.db.models.fields.foreignkey.FlexibleForeignKey(on_delete=django.db.models.deletion.CASCADE, to='sentry.Organization')),
                ('owner', sentry.db.models.fields.foreignkey.FlexibleForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL)),
                ('project', sentry.db.models.fields.foreignkey.FlexibleForeignKey(db_constraint=False, on_delete=django.db.models.deletion.CASCADE, to='sentry.Project')),
            ],
            options={
                'db_table': 'sentry_discoverkeytransaction',
            },
        ),
        migrations.AlterUniqueTogether(
            name='keytransaction',
            unique_together=set([('project', 'transaction')]),
        ),
    ]