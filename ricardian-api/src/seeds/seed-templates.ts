import dataSource from '../../ormconfig';
import { ContractTemplate } from '../contracts/entities/contract-template.entity';

const templates = [
  {
    slug: 'milestone',
    title: 'Milestone-Based Contract',
    description: 'Payment released per approved milestone',
    default_config: { payment_type: 'per_milestone', auto_release: true },
  },
  {
    slug: 'fixed',
    title: 'Fixed-Price Contract',
    description: 'Single payment on project completion',
    default_config: { payment_type: 'fixed', auto_release: false },
  },
  {
    slug: 'retainer',
    title: 'Retainer Contract',
    description: 'Recurring monthly payments',
    default_config: { payment_type: 'recurring', interval: 'monthly' },
  },
];

async function seed() {
  await dataSource.initialize();

  const repo = dataSource.getRepository(ContractTemplate);

  for (const tpl of templates) {
    const exists = await repo.findOneBy({ slug: tpl.slug });
    if (!exists) {
      await repo.save(repo.create(tpl));
      console.log(`Inserted template: ${tpl.slug}`);
    } else {
      console.log(`Template already exists: ${tpl.slug}`);
    }
  }

  await dataSource.destroy();
  console.log('Seed complete.');
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
